// Roles, oldest first. Add dates or a one-line summary per role when ready.
export type Position = {
  role: string
  company: string
  location: string
}

export const positions: Position[] = [
  { role: "Full Stack Engineer (GET)", company: "STL Digital", location: "Bangalore" },
  { role: "Software Engineer", company: "Aadhan Media", location: "Hyderabad" },
  { role: "Senior Software Engineer", company: "Accenture", location: "Hyderabad" },
]

// A short note under the total experience. Keep each line to one sentence.
export const experienceNote: Array<{ label: string; text: string }> = [
  {
    label: "Brought to life",
    text: "Newsroom tools, real-time match coverage, and AI features that editors use every day.",
  },
  {
    label: "Learned",
    text: "How to own a product end to end — interface, API, data, cloud, and the seams between them.",
  },
  {
    label: "Designed",
    text: "Real-time systems on the edge, editorial workflows, and AI pipelines where models plan and code executes.",
  },
]
