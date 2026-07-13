import Foundation

struct ShareableGroup: Codable {
    let id: String
    let name: String
    let emoji: String
    let shareCode: String
    let members: [ShareablePerson]
    let expenses: [ShareableExpense]
    let exportedAt: Date

    struct ShareablePerson: Codable {
        let id: String
        let name: String
        let emoji: String
    }

    struct ShareableExpense: Codable {
        let id: String
        let title: String
        let amount: Double
        let paidById: String
        let participantIds: [String]
        let category: String
        let createdAt: Date
    }

    init(from group: SplitGroup) {
        self.id = group.id.uuidString
        self.name = group.name
        self.emoji = group.emoji
        self.shareCode = group.shareCode
        self.exportedAt = Date()
        self.members = group.members.map {
            ShareablePerson(id: $0.id.uuidString, name: $0.name, emoji: $0.emoji)
        }
        self.expenses = group.expenses.map { expense in
            ShareableExpense(
                id: expense.id.uuidString,
                title: expense.title,
                amount: expense.amount,
                paidById: expense.paidBy?.id.uuidString ?? "",
                participantIds: expense.participants.map { $0.id.uuidString },
                category: expense.category.rawValue,
                createdAt: expense.createdAt
            )
        }
    }

    func toJSONData() throws -> Data {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        return try encoder.encode(self)
    }

    static func from(data: Data) throws -> ShareableGroup {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode(ShareableGroup.self, from: data)
    }
}
