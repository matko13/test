import SwiftUI
import SwiftData

struct AddGroupView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var selectedEmoji = "💰"

    private let emojis = ["💰", "🍕", "🏖️", "🏠", "🎉", "🚗", "🍺", "⚽", "🎿", "🏕️", "✈️", "🎮"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Nazwa grupy") {
                    TextField("np. Wyjazd w góry", text: $name)
                        .font(.body)
                }

                Section("Ikonka") {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 6), spacing: 12) {
                        ForEach(emojis, id: \.self) { emoji in
                            Text(emoji)
                                .font(.system(size: 32))
                                .frame(width: 52, height: 52)
                                .background(
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(selectedEmoji == emoji ? Color.blue.opacity(0.15) : Color.clear)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(selectedEmoji == emoji ? Color.blue : Color.clear, lineWidth: 2)
                                )
                                .onTapGesture {
                                    selectedEmoji = emoji
                                }
                        }
                    }
                    .padding(.vertical, 4)
                }
            }
            .navigationTitle("Nowa grupa")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Anuluj") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Utwórz") {
                        createGroup()
                    }
                    .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
                    .fontWeight(.semibold)
                }
            }
        }
    }

    private func createGroup() {
        let group = SplitGroup(name: name.trimmingCharacters(in: .whitespaces), emoji: selectedEmoji)
        modelContext.insert(group)
        dismiss()
    }
}
