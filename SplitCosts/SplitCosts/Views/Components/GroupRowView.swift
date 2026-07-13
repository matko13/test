import SwiftUI

struct GroupRowView: View {
    let group: SplitGroup

    var body: some View {
        HStack(spacing: 14) {
            Text(group.emoji)
                .font(.system(size: 36))
                .frame(width: 50, height: 50)
                .background(.ultraThinMaterial)
                .clipShape(RoundedRectangle(cornerRadius: 12))

            VStack(alignment: .leading, spacing: 4) {
                Text(group.name)
                    .font(.headline)

                HStack(spacing: 12) {
                    Label("\(group.members.count)", systemImage: "person.2")
                    Label("\(group.expenses.count)", systemImage: "receipt")
                }
                .font(.caption)
                .foregroundStyle(.secondary)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                Text(group.totalExpenses.formatted(.currency(code: "PLN")))
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundStyle(.blue)

                Text(group.createdAt.formatted(.dateTime.day().month()))
                    .font(.caption2)
                    .foregroundStyle(.tertiary)
            }
        }
        .padding(.vertical, 4)
    }
}
