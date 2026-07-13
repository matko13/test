import Foundation
import SwiftData
import SwiftUI

@Observable
final class GroupViewModel {
    var group: SplitGroup

    init(group: SplitGroup) {
        self.group = group
    }

    // MARK: - Balances

    func balances() -> [PersonBalance] {
        group.members.map { person in
            let totalPaid = group.expenses
                .filter { $0.paidBy?.id == person.id }
                .reduce(0) { $0 + $1.amount }

            let totalOwed = group.expenses
                .filter { $0.participants.contains(where: { $0.id == person.id }) }
                .reduce(0) { $0 + $1.amountPerPerson }

            return PersonBalance(person: person, totalPaid: totalPaid, totalOwed: totalOwed)
        }
        .sorted { abs($0.balance) > abs($1.balance) }
    }

    /// Minimize the number of transactions to settle all debts.
    /// Uses a greedy algorithm matching the largest creditor with the largest debtor.
    func settlements() -> [Settlement] {
        let personBalances = balances()
        var debtors: [(person: Person, amount: Double)] = []
        var creditors: [(person: Person, amount: Double)] = []

        for pb in personBalances {
            if pb.balance < -0.01 {
                debtors.append((pb.person, abs(pb.balance)))
            } else if pb.balance > 0.01 {
                creditors.append((pb.person, pb.balance))
            }
        }

        debtors.sort { $0.amount > $1.amount }
        creditors.sort { $0.amount > $1.amount }

        var result: [Settlement] = []
        var di = 0
        var ci = 0

        while di < debtors.count && ci < creditors.count {
            let transferAmount = min(debtors[di].amount, creditors[ci].amount)
            if transferAmount > 0.01 {
                result.append(Settlement(
                    from: debtors[di].person,
                    to: creditors[ci].person,
                    amount: (transferAmount * 100).rounded() / 100
                ))
            }
            debtors[di].amount -= transferAmount
            creditors[ci].amount -= transferAmount

            if debtors[di].amount < 0.01 { di += 1 }
            if creditors[ci].amount < 0.01 { ci += 1 }
        }

        return result
    }

    // MARK: - Expense Stats

    func expensesByCategory() -> [(category: ExpenseCategory, total: Double)] {
        var totals: [ExpenseCategory: Double] = [:]
        for expense in group.expenses {
            totals[expense.category, default: 0] += expense.amount
        }
        return totals.map { ($0.key, $0.value) }
            .sorted { $0.total > $1.total }
    }

    func expensesByPerson() -> [(person: Person, total: Double)] {
        var totals: [UUID: (person: Person, total: Double)] = [:]
        for expense in group.expenses {
            guard let payer = expense.paidBy else { continue }
            totals[payer.id, default: (payer, 0)].total += expense.amount
        }
        return totals.values.sorted { $0.total > $1.total }
    }

    func averageExpensePerPerson() -> Double {
        guard !group.members.isEmpty else { return 0 }
        return group.totalExpenses / Double(group.members.count)
    }

    // MARK: - Share

    func exportGroup() -> Data? {
        let shareable = ShareableGroup(from: group)
        return try? shareable.toJSONData()
    }

    func shareActivityItems() -> [Any] {
        guard let data = exportGroup(),
              let jsonString = String(data: data, encoding: .utf8) else {
            return []
        }
        let message = """
        Dołącz do grupy "\(group.name)" w SplitCosts!
        Kod: \(group.shareCode)

        Dane grupy:
        \(jsonString)
        """
        return [message]
    }
}
