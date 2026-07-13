import SwiftUI

struct ExpenseListSection: View {
    @Environment(\.modelContext) private var modelContext
    let group: SplitGroup

    var body: some View {
        Group {
            if group.expenses.isEmpty {
                VStack(spacing: 16) {
                    Spacer()
                    Image(systemName: "receipt")
                        .font(.system(size: 48))
                        .foregroundStyle(.secondary.opacity(0.5))
                    Text("Brak wydatków")
                        .font(.headline)
                        .foregroundStyle(.secondary)
                    Text("Dodaj pierwszy wydatek klikając +")
                        .font(.subheadline)
                        .foregroundStyle(.tertiary)
                    Spacer()
                }
                .frame(maxWidth: .infinity)
            } else {
                List {
                    ForEach(sortedExpenses) { expense in
                        ExpenseRowView(expense: expense)
                    }
                    .onDelete(perform: deleteExpenses)
                }
                .listStyle(.insetGrouped)
            }
        }
    }

    private var sortedExpenses: [Expense] {
        group.expenses.sorted { $0.createdAt > $1.createdAt }
    }

    private func deleteExpenses(at offsets: IndexSet) {
        let sorted = sortedExpenses
        for index in offsets {
            let expense = sorted[index]
            if let idx = group.expenses.firstIndex(where: { $0.id == expense.id }) {
                group.expenses.remove(at: idx)
            }
            modelContext.delete(expense)
        }
    }
}

struct ExpenseRowView: View {
    let expense: Expense

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: expense.category.icon)
                .font(.title3)
                .foregroundStyle(.white)
                .frame(width: 40, height: 40)
                .background(categoryColor)
                .clipShape(RoundedRectangle(cornerRadius: 10))

            VStack(alignment: .leading, spacing: 3) {
                Text(expense.title)
                    .font(.subheadline)
                    .fontWeight(.medium)

                HStack(spacing: 4) {
                    if let payer = expense.paidBy {
                        Text("\(payer.emoji) \(payer.name)")
                    }
                    Text("•")
                    Text("\(expense.participants.count) os.")
                }
                .font(.caption)
                .foregroundStyle(.secondary)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 3) {
                Text(expense.amount.formatted(.currency(code: "PLN")))
                    .font(.subheadline)
                    .fontWeight(.semibold)

                Text(expense.amountPerPerson.formatted(.currency(code: "PLN")) + "/os.")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 2)
    }

    private var categoryColor: Color {
        switch expense.category {
        case .food: return .orange
        case .drinks: return .brown
        case .transport: return .blue
        case .accommodation: return .purple
        case .entertainment: return .pink
        case .shopping: return .green
        case .bills: return .gray
        case .other: return .secondary
        }
    }
}
