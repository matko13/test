import SwiftUI
import SwiftData

struct ContentView: View {
    var body: some View {
        GroupListView()
    }
}

#Preview {
    ContentView()
        .modelContainer(for: [SplitGroup.self, Person.self, Expense.self], inMemory: true)
}
