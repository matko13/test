import SwiftUI
import SwiftData

struct GroupListView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \SplitGroup.createdAt, order: .reverse) private var groups: [SplitGroup]
    @State private var showingAddGroup = false
    @State private var showingImport = false
    @State private var importText = ""
    @State private var showImportError = false

    var body: some View {
        NavigationStack {
            ZStack {
                if groups.isEmpty {
                    emptyState
                } else {
                    groupList
                }
            }
            .navigationTitle("SplitCosts")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Button {
                            showingAddGroup = true
                        } label: {
                            Label("Nowa grupa", systemImage: "plus.circle")
                        }
                        Button {
                            showingImport = true
                        } label: {
                            Label("Importuj grupę", systemImage: "square.and.arrow.down")
                        }
                    } label: {
                        Image(systemName: "plus")
                            .font(.title3)
                            .fontWeight(.semibold)
                    }
                }
            }
            .sheet(isPresented: $showingAddGroup) {
                AddGroupView()
            }
            .alert("Importuj grupę", isPresented: $showingImport) {
                TextField("Wklej dane JSON grupy", text: $importText)
                Button("Importuj") { importGroup() }
                Button("Anuluj", role: .cancel) { importText = "" }
            }
            .alert("Błąd importu", isPresented: $showImportError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text("Nie udało się zaimportować grupy. Sprawdź format danych.")
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 20) {
            Image(systemName: "person.3.fill")
                .font(.system(size: 64))
                .foregroundStyle(.blue.opacity(0.6))

            Text("Brak grup")
                .font(.title2)
                .fontWeight(.bold)

            Text("Utwórz nową grupę, żeby zacząć\ndzielić koszty ze znajomymi")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            Button {
                showingAddGroup = true
            } label: {
                Label("Utwórz grupę", systemImage: "plus.circle.fill")
                    .font(.headline)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
            }
            .buttonStyle(.borderedProminent)
            .padding(.top, 8)
        }
        .padding()
    }

    private var groupList: some View {
        List {
            ForEach(groups) { group in
                NavigationLink(destination: GroupDetailView(group: group)) {
                    GroupRowView(group: group)
                }
            }
            .onDelete(perform: deleteGroups)
        }
        .listStyle(.insetGrouped)
    }

    private func deleteGroups(at offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(groups[index])
        }
    }

    private func importGroup() {
        guard let data = importText.data(using: .utf8),
              let shareable = try? ShareableGroup.from(data: data) else {
            showImportError = true
            importText = ""
            return
        }

        let group = SplitGroup(name: shareable.name, emoji: shareable.emoji)

        var personMap: [String: Person] = [:]
        for sp in shareable.members {
            let person = Person(name: sp.name, emoji: sp.emoji)
            personMap[sp.id] = person
            modelContext.insert(person)
            group.members.append(person)
        }

        for se in shareable.expenses {
            guard let payer = personMap[se.paidById] else { continue }
            let participants = se.participantIds.compactMap { personMap[$0] }
            let category = ExpenseCategory(rawValue: se.category) ?? .other
            let expense = Expense(
                title: se.title,
                amount: se.amount,
                paidBy: payer,
                participants: participants,
                category: category
            )
            group.expenses.append(expense)
        }

        modelContext.insert(group)
        importText = ""
    }
}
