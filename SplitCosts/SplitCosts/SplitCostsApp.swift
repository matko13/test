import SwiftUI
import SwiftData

@main
struct SplitCostsApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: [SplitGroup.self, Person.self, Expense.self])
    }
}
