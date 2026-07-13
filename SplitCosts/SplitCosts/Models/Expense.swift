import Foundation
import SwiftData

@Model
final class Expense: Identifiable {
    var id: UUID
    var title: String
    var amount: Double
    var paidBy: Person?
    var participants: [Person]
    var createdAt: Date
    var category: ExpenseCategory

    init(
        title: String,
        amount: Double,
        paidBy: Person,
        participants: [Person],
        category: ExpenseCategory = .other
    ) {
        self.id = UUID()
        self.title = title
        self.amount = amount
        self.paidBy = paidBy
        self.participants = participants
        self.createdAt = Date()
        self.category = category
    }

    var amountPerPerson: Double {
        guard !participants.isEmpty else { return 0 }
        return amount / Double(participants.count)
    }
}

enum ExpenseCategory: String, Codable, CaseIterable, Identifiable {
    case food = "Jedzenie"
    case drinks = "Napoje"
    case transport = "Transport"
    case accommodation = "Nocleg"
    case entertainment = "Rozrywka"
    case shopping = "Zakupy"
    case bills = "Rachunki"
    case other = "Inne"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .food: return "fork.knife"
        case .drinks: return "cup.and.saucer.fill"
        case .transport: return "car.fill"
        case .accommodation: return "bed.double.fill"
        case .entertainment: return "gamecontroller.fill"
        case .shopping: return "bag.fill"
        case .bills: return "doc.text.fill"
        case .other: return "ellipsis.circle.fill"
        }
    }

    var color: String {
        switch self {
        case .food: return "orange"
        case .drinks: return "brown"
        case .transport: return "blue"
        case .accommodation: return "purple"
        case .entertainment: return "pink"
        case .shopping: return "green"
        case .bills: return "gray"
        case .other: return "secondary"
        }
    }
}
