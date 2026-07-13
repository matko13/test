import Foundation
import SwiftData

@Model
final class SplitGroup: Identifiable {
    var id: UUID
    var name: String
    var emoji: String
    var shareCode: String
    var members: [Person]
    var createdAt: Date

    @Relationship(deleteRule: .cascade)
    var expenses: [Expense]

    init(name: String, emoji: String = "💰") {
        self.id = UUID()
        self.name = name
        self.emoji = emoji
        self.shareCode = SplitGroup.generateShareCode()
        self.members = []
        self.expenses = []
        self.createdAt = Date()
    }

    var totalExpenses: Double {
        expenses.reduce(0) { $0 + $1.amount }
    }

    private static func generateShareCode() -> String {
        let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        return String((0..<6).map { _ in chars.randomElement()! })
    }
}
