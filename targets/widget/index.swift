import SwiftUI
import WidgetKit

private let appGroup = "group.com.xira.life.noji"
private let snapshotKey = "todaySnapshot"

struct TodaySnapshot: Codable {
  var level: String
  var newCount: Int
  var due: Int
  var known: Int
  var total: Int
  var updatedAt: Double

  var todayTotal: Int { newCount + due }
  var progress: Double { total > 0 ? Double(known) / Double(total) : 0 }

  static let placeholder = TodaySnapshot(
    level: "N5", newCount: 8, due: 12, known: 40, total: 118, updatedAt: 0
  )
}

func loadSnapshot() -> TodaySnapshot {
  guard
    let defaults = UserDefaults(suiteName: appGroup),
    let raw = defaults.string(forKey: snapshotKey),
    let data = raw.data(using: .utf8),
    let snapshot = try? JSONDecoder().decode(TodaySnapshot.self, from: data)
  else { return .placeholder }
  return snapshot
}

struct TodayEntry: TimelineEntry {
  let date: Date
  let snapshot: TodaySnapshot
}

struct TodayProvider: TimelineProvider {
  func placeholder(in context: Context) -> TodayEntry {
    TodayEntry(date: Date(), snapshot: .placeholder)
  }

  func getSnapshot(in context: Context, completion: @escaping (TodayEntry) -> Void) {
    completion(TodayEntry(date: Date(), snapshot: loadSnapshot()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<TodayEntry>) -> Void) {
    let entry = TodayEntry(date: Date(), snapshot: loadSnapshot())
    let nextRefresh = Calendar.current.date(byAdding: .hour, value: 1, to: Date())
      ?? Date().addingTimeInterval(3600)
    completion(Timeline(entries: [entry], policy: .after(nextRefresh)))
  }
}

struct StatRow: View {
  let label: String
  let value: Int

  var body: some View {
    HStack {
      Text(label)
        .font(.subheadline)
        .foregroundStyle(.secondary)
      Spacer()
      Text("\(value)")
        .font(.subheadline)
        .fontWeight(.semibold)
        .monospacedDigit()
    }
  }
}

struct SmallView: View {
  let snapshot: TodaySnapshot

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      HStack {
        Text("noji")
          .font(.caption2)
          .fontWeight(.semibold)
          .foregroundStyle(.secondary)
        Spacer()
        Text(snapshot.level)
          .font(.caption2)
          .foregroundStyle(.secondary)
      }
      Spacer()
      Text("\(snapshot.todayTotal)")
        .font(.system(size: 46, weight: .bold, design: .rounded))
        .monospacedDigit()
      Text(snapshot.todayTotal == 0 ? "오늘 다 했어요" : "단어 남음")
        .font(.caption)
        .foregroundStyle(.secondary)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .containerBackground(for: .widget) { Color(.systemBackground) }
  }
}

struct MediumView: View {
  let snapshot: TodaySnapshot

  var body: some View {
    HStack(spacing: 18) {
      VStack(alignment: .leading, spacing: 2) {
        Text("오늘")
          .font(.caption2)
          .fontWeight(.semibold)
          .foregroundStyle(.secondary)
        Spacer()
        Text("\(snapshot.todayTotal)")
          .font(.system(size: 52, weight: .bold, design: .rounded))
          .monospacedDigit()
        Text(snapshot.todayTotal == 0 ? "다 했어요" : "단어 남음")
          .font(.caption)
          .foregroundStyle(.secondary)
      }

      VStack(alignment: .leading, spacing: 8) {
        StatRow(label: "새 단어", value: snapshot.newCount)
        Divider()
        StatRow(label: "복습", value: snapshot.due)
        Spacer()
        ProgressView(value: snapshot.progress) {
          HStack {
            Text(snapshot.level)
              .font(.caption2)
              .foregroundStyle(.secondary)
            Spacer()
            Text("\(Int(snapshot.progress * 100))%")
              .font(.caption2)
              .monospacedDigit()
              .foregroundStyle(.secondary)
          }
        }
        .tint(.primary)
      }
      .frame(maxWidth: 150)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .containerBackground(for: .widget) { Color(.systemBackground) }
  }
}

struct NojiWidgetView: View {
  @Environment(\.widgetFamily) var family
  let entry: TodayEntry

  var body: some View {
    switch family {
    case .systemSmall:
      SmallView(snapshot: entry.snapshot)
    default:
      MediumView(snapshot: entry.snapshot)
    }
  }
}

struct NojiWidget: Widget {
  let kind = "NojiWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: TodayProvider()) { entry in
      NojiWidgetView(entry: entry)
        .widgetURL(URL(string: "noji://"))
    }
    .configurationDisplayName("오늘의 학습")
    .description("오늘 학습할 단어 수와 진도를 보여줘요.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}

@main
struct NojiWidgetBundle: WidgetBundle {
  var body: some Widget {
    NojiWidget()
  }
}
