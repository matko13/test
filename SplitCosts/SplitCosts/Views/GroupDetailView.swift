import SwiftUI
import SwiftData

struct GroupDetailView: View {
    @Environment(\.modelContext) private var modelContext
    let group: SplitGroup
    @State private var viewModel: GroupViewModel
    @State private var showingAddExpense = false
    @State private var showingAddPerson = false
    @State private var showingShare = false
    @State private var selectedTab = 0

    init(group: SplitGroup) {
        self.group = group
        self._viewModel = State(initialValue: GroupViewModel(group: group))
    }

    var body: some View {
        VStack(spacing: 0) {
            headerCard

            Picker("Widok", selection: $selectedTab) {
                Text("Wydatki").tag(0)
                Text("Rozliczenia").tag(1)
                Text("Statystyki").tag(2)
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)
            .padding(.vertical, 8)

            TabView(selection: $selectedTab) {
                ExpenseListSection(group: group)
                    .tag(0)
                SettlementSection(viewModel: viewModel)
                    .tag(1)
                StatisticsSection(viewModel: viewModel, group: group)
                    .tag(2)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
        }
        .navigationTitle(group.name)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                Button {
                    showingShare = true
                } label: {
                    Image(systemName: "square.and.arrow.up")
                }

                Menu {
                    Button {
                        showingAddPerson = true
                    } label: {
                        Label("Dodaj osobę", systemImage: "person.badge.plus")
                    }
                    Button {
                        showingAddExpense = true
                    } label: {
                        Label("Dodaj wydatek", systemImage: "plus.circle")
                    }
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showingAddExpense) {
            AddExpenseView(group: group)
        }
        .sheet(isPresented: $showingAddPerson) {
            AddPersonView(group: group)
        }
        .sheet(isPresented: $showingShare) {
            ShareSheet(activityItems: viewModel.shareActivityItems())
        }
    }

    private var headerCard: some View {
        VStack(spacing: 12) {
            HStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Suma wydatków")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text(group.totalExpenses.formatted(.currency(code: "PLN")))
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundStyle(.blue)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text("Osoby")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text("\(group.members.count)")
                        .font(.title)
                        .fontWeight(.bold)
                }
            }

            if !group.members.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(group.members) { person in
                            VStack(spacing: 2) {
                                Text(person.emoji)
                                    .font(.title3)
                                Text(person.name.prefix(8))
                                    .font(.caption2)
                                    .lineLimit(1)
                            }
                            .frame(width: 56)
                            .padding(.vertical, 4)
                            .background(.ultraThinMaterial)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        }

                        Button {
                            showingAddPerson = true
                        } label: {
                            VStack(spacing: 2) {
                                Image(systemName: "plus")
                                    .font(.title3)
                                Text("Dodaj")
                                    .font(.caption2)
                            }
                            .frame(width: 56)
                            .padding(.vertical, 4)
                            .foregroundStyle(.blue)
                        }
                    }
                }
            }

            HStack {
                Label("Kod grupy:", systemImage: "key.fill")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text(group.shareCode)
                    .font(.caption)
                    .fontWeight(.bold)
                    .fontDesign(.monospaced)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(.blue.opacity(0.1))
                    .clipShape(Capsule())
            }
        }
        .padding()
        .background(.ultraThinMaterial)
    }
}
