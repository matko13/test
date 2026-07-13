import Foundation
import SwiftData

@Model
final class Person: Identifiable {
    var id: UUID
    var name: String
    var emoji: String
    var createdAt: Date

    @Relationship(inverse: \SplitGroup.members)
    var groups: [SplitGroup]?

    @Relationship(inverse: \Expense.paidBy)
    var expensesPaid: [Expense]?

    init(name: String, emoji: String = "🧑") {
        self.id = UUID()
        self.name = name
        self.emoji = emoji
        self.createdAt = Date()
    }
}

extension Person: Hashable {
    static func == (lhs: Person, rhs: Person) -> Bool {
        lhs.id == rhs.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}
