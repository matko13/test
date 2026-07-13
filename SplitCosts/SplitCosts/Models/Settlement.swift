import Foundation

struct Settlement: Identifiable, Hashable {
    let id = UUID()
    let from: Person
    let to: Person
    let amount: Double
}

struct PersonBalance: Identifiable {
    let id = UUID()
    let person: Person
    let totalPaid: Double
    let totalOwed: Double

    var balance: Double {
        totalPaid - totalOwed
    }
}
