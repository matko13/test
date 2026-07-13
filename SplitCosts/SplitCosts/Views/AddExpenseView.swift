import SwiftUI
import SwiftData

struct AddExpenseView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    let group: SplitGroup

    @State private var title = ""
    @State private var amountText = ""
    @State private var selectedPayer: Person?
    @State private var selectedParticipants: Set<UUID> = []
    @State private var category: ExpenseCategory = .other
    @State private var selectAll = true

    var body: some View {
        NavigationStack {
            Form {
                Section("Szczegóły") {
                    TextField("Co kupiono?", text: $title)

                    HStack {
                        Text("PLN")
                            .foregroundStyle(.secondary)
                            .fontWeight(.medium)
                        TextField("0.00", text: $amountText)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                }

                Section("Kategoria") {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 8) {
                        ForEach(ExpenseCategory.allCases) { cat in
                            VStack(spacing: 4) {
                                Image(systemName: cat.icon)
                                    .font(.title3)
                                Text(cat.rawValue)
                                    .font(.caption2)
                                    .lineLimit(1)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                            .background(
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(category == cat ? Color.blue.opacity(0.15) : Color(.systemGray6))
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(category == cat ? Color.blue : Color.clear, lineWidth: 1.5)
                            )
                            .onTapGesture {
                                category = cat
                            }
                        }
                    }
                    .padding(.vertical, 4)
                }

                Section("Kto zapłacił?") {
                    if group.members.isEmpty {
                        Text("Najpierw dodaj osoby do grupy")
                            .foregroundStyle(.secondary)
                            .italic()
                    } else {
                        ForEach(group.members) { person in
                            Button {
                                selectedPayer = person
                            } label: {
                                HStack {
                                    Text(person.emoji)
                                    Text(person.name)
                                        .foregroundStyle(.primary)
                                    Spacer()
                                    if selectedPayer?.id == person.id {
                                        Image(systemName: "checkmark.circle.fill")
                                            .foregroundStyle(.blue)
                                    }
                                }
                            }
                        }
                    }
                }

                Section {
                    Toggle("Wszyscy", isOn: $selectAll)
                        .onChange(of: selectAll) { _, newVal in
                            if newVal {
                                selectedParticipants = Set(group.members.map(\.id))
                            } else {
                                selectedParticipants.removeAll()
                            }
                        }

                    ForEach(group.members) { person in
                        Button {
                            toggleParticipant(person)
                        } label: {
                            HStack {
                                Text(person.emoji)
                                Text(person.name)
                                    .foregroundStyle(.primary)
                                Spacer()
                                Image(systemName: selectedParticipants.contains(person.id)
                                      ? "checkmark.square.fill"
                                      : "square")
                                    .foregroundStyle(selectedParticipants.contains(person.id) ? .blue : .secondary)
                            }
                        }
                    }
                } header: {
                    Text("Dzielone między")
                } footer: {
                    if !selectedParticipants.isEmpty, let amount = Double(amountText.replacingOccurrences(of: ",", with: ".")) {
                        let perPerson = amount / Double(selectedParticipants.count)
                        Text("Po \(perPerson.formatted(.currency(code: "PLN"))) na osobę")
                    }
                }
            }
            .navigationTitle("Nowy wydatek")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Anuluj") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Dodaj") { addExpense() }
                        .disabled(!isValid)
                        .fontWeight(.semibold)
                }
            }
            .onAppear {
                selectedParticipants = Set(group.members.map(\.id))
                selectedPayer = group.members.first
            }
        }
    }

    private var isValid: Bool {
        guard !title.trimmingCharacters(in: .whitespaces).isEmpty else { return false }
        guard let amount = Double(amountText.replacingOccurrences(of: ",", with: ".")), amount > 0 else { return false }
        guard selectedPayer != nil else { return false }
        guard !selectedParticipants.isEmpty else { return false }
        return true
    }

    private func toggleParticipant(_ person: Person) {
        if selectedParticipants.contains(person.id) {
            selectedParticipants.remove(person.id)
        } else {
            selectedParticipants.insert(person.id)
        }
        selectAll = selectedParticipants.count == group.members.count
    }

    private func addExpense() {
        guard let payer = selectedPayer,
              let amount = Double(amountText.replacingOccurrences(of: ",", with: ".")) else {
            return
        }

        let participants = group.members.filter { selectedParticipants.contains($0.id) }
        let expense = Expense(
            title: title.trimmingCharacters(in: .whitespaces),
            amount: amount,
            paidBy: payer,
            participants: participants,
            category: category
        )
        modelContext.insert(expense)
        group.expenses.append(expense)
        dismiss()
    }
}
