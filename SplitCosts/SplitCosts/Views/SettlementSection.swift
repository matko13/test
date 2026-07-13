import SwiftUI

struct SettlementSection: View {
    let viewModel: GroupViewModel

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                balancesCard
                settlementsCard
            }
            .padding()
        }
    }

    private var balancesCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Bilans", systemImage: "chart.bar.fill")
                .font(.headline)

            let personBalances = viewModel.balances()

            if personBalances.isEmpty {
                Text("Dodaj osoby i wydatki, żeby zobaczyć bilans")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .padding(.vertical, 8)
            } else {
                ForEach(personBalances) { pb in
                    HStack {
                        Text(pb.person.emoji)
                        Text(pb.person.name)
                            .font(.subheadline)

                        Spacer()

                        VStack(alignment: .trailing, spacing: 1) {
                            Text(pb.balance.formatted(.currency(code: "PLN")))
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundStyle(pb.balance >= 0 ? .green : .red)
                            HStack(spacing: 4) {
                                Text("zapłacił: \(pb.totalPaid.formatted(.currency(code: "PLN")))")
                                Text("•")
                                Text("dług: \(pb.totalOwed.formatted(.currency(code: "PLN")))")
                            }
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.vertical, 4)

                    if pb.id != personBalances.last?.id {
                        Divider()
                    }
                }
            }
        }
        .padding()
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private var settlementsCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Kto komu ile wisi", systemImage: "arrow.left.arrow.right")
                .font(.headline)

            let settlements = viewModel.settlements()

            if settlements.isEmpty {
                VStack(spacing: 8) {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 36))
                        .foregroundStyle(.green)
                    Text("Wszyscy rozliczeni!")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
            } else {
                ForEach(settlements) { settlement in
                    HStack(spacing: 8) {
                        VStack(spacing: 2) {
                            Text(settlement.from.emoji)
                                .font(.title3)
                            Text(settlement.from.name)
                                .font(.caption2)
                                .lineLimit(1)
                        }
                        .frame(width: 60)

                        VStack(spacing: 2) {
                            Image(systemName: "arrow.right")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            Text(settlement.amount.formatted(.currency(code: "PLN")))
                                .font(.subheadline)
                                .fontWeight(.bold)
                                .foregroundStyle(.red)
                        }

                        VStack(spacing: 2) {
                            Text(settlement.to.emoji)
                                .font(.title3)
                            Text(settlement.to.name)
                                .font(.caption2)
                                .lineLimit(1)
                        }
                        .frame(width: 60)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(Color.red.opacity(0.05))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }
            }
        }
        .padding()
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}
