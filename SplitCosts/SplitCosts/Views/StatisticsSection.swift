import SwiftUI

struct StatisticsSection: View {
    let viewModel: GroupViewModel
    let group: SplitGroup

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                overviewCard
                categoryBreakdownCard
                spenderRankingCard
            }
            .padding()
        }
    }

    private var overviewCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Podsumowanie", systemImage: "chart.pie.fill")
                .font(.headline)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                StatCard(
                    title: "Łącznie",
                    value: group.totalExpenses.formatted(.currency(code: "PLN")),
                    icon: "banknote",
                    color: .blue
                )
                StatCard(
                    title: "Średnia/os.",
                    value: viewModel.averageExpensePerPerson().formatted(.currency(code: "PLN")),
                    icon: "person",
                    color: .purple
                )
                StatCard(
                    title: "Wydatki",
                    value: "\(group.expenses.count)",
                    icon: "receipt",
                    color: .orange
                )
                StatCard(
                    title: "Osoby",
                    value: "\(group.members.count)",
                    icon: "person.3",
                    color: .green
                )
            }
        }
        .padding()
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private var categoryBreakdownCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Kategorie", systemImage: "tag.fill")
                .font(.headline)

            let categories = viewModel.expensesByCategory()

            if categories.isEmpty {
                Text("Brak danych")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .padding(.vertical, 8)
            } else {
                ForEach(categories, id: \.category) { item in
                    HStack(spacing: 10) {
                        Image(systemName: item.category.icon)
                            .frame(width: 24)
                            .foregroundStyle(categoryColor(item.category))

                        Text(item.category.rawValue)
                            .font(.subheadline)

                        Spacer()

                        Text(item.total.formatted(.currency(code: "PLN")))
                            .font(.subheadline)
                            .fontWeight(.medium)

                        let pct = group.totalExpenses > 0
                            ? item.total / group.totalExpenses * 100
                            : 0
                        Text("\(Int(pct))%")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .frame(width: 36, alignment: .trailing)
                    }
                    .padding(.vertical, 2)

                    GeometryReader { geometry in
                        let pct = group.totalExpenses > 0
                            ? item.total / group.totalExpenses
                            : 0
                        RoundedRectangle(cornerRadius: 3)
                            .fill(categoryColor(item.category).opacity(0.3))
                            .frame(width: geometry.size.width * pct, height: 6)
                    }
                    .frame(height: 6)
                }
            }
        }
        .padding()
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private var spenderRankingCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Ranking wydatków", systemImage: "trophy.fill")
                .font(.headline)

            let ranking = viewModel.expensesByPerson()

            if ranking.isEmpty {
                Text("Brak danych")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .padding(.vertical, 8)
            } else {
                ForEach(Array(ranking.enumerated()), id: \.element.person.id) { index, item in
                    HStack(spacing: 10) {
                        Text(medal(for: index))
                            .font(.title3)
                            .frame(width: 28)

                        Text(item.person.emoji)
                        Text(item.person.name)
                            .font(.subheadline)

                        Spacer()

                        Text(item.total.formatted(.currency(code: "PLN")))
                            .font(.subheadline)
                            .fontWeight(.semibold)
                    }
                    .padding(.vertical, 4)

                    if index < ranking.count - 1 {
                        Divider()
                    }
                }
            }
        }
        .padding()
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private func medal(for index: Int) -> String {
        switch index {
        case 0: return "🥇"
        case 1: return "🥈"
        case 2: return "🥉"
        default: return "\(index + 1)."
        }
    }

    private func categoryColor(_ category: ExpenseCategory) -> Color {
        switch category {
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

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundStyle(color)

            Text(value)
                .font(.subheadline)
                .fontWeight(.bold)
                .lineLimit(1)
                .minimumScaleFactor(0.7)

            Text(title)
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(color.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
