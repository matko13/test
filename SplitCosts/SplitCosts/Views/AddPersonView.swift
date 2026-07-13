import SwiftUI
import SwiftData

struct AddPersonView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    let group: SplitGroup
    @State private var name = ""
    @State private var selectedEmoji = "🧑"

    private let emojis = [
        "🧑", "👩", "👨", "🧔", "👱", "👩‍🦰", "👨‍🦱", "👩‍🦳",
        "🦸", "🧑‍🍳", "🧑‍💻", "🧑‍🎨", "🧑‍🚀", "🧑‍🎤", "🧝", "🧙"
    ]

    var body: some View {
        NavigationStack {
            Form {
                Section("Imię") {
                    TextField("np. Tomek", text: $name)
                }

                Section("Avatar") {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 8), spacing: 10) {
                        ForEach(emojis, id: \.self) { emoji in
                            Text(emoji)
                                .font(.system(size: 28))
                                .frame(width: 40, height: 40)
                                .background(
                                    RoundedRectangle(cornerRadius: 8)
                                        .fill(selectedEmoji == emoji ? Color.blue.opacity(0.15) : Color.clear)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(selectedEmoji == emoji ? Color.blue : Color.clear, lineWidth: 2)
                                )
                                .onTapGesture {
                                    selectedEmoji = emoji
                                }
                        }
                    }
                    .padding(.vertical, 4)
                }

                if !group.members.isEmpty {
                    Section("Już w grupie") {
                        ForEach(group.members) { person in
                            HStack {
                                Text(person.emoji)
                                Text(person.name)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Dodaj osobę")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Anuluj") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Dodaj") { addPerson() }
                        .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
                        .fontWeight(.semibold)
                }
            }
        }
    }

    private func addPerson() {
        let person = Person(name: name.trimmingCharacters(in: .whitespaces), emoji: selectedEmoji)
        modelContext.insert(person)
        group.members.append(person)
        dismiss()
    }
}
