# GymForage (Gym Tracker) 🏋️‍♂️

GymForage is a modern, full-stack workout tracking application built with Next.js. It allows users to easily log their gym sessions, track personal records, and monitor their fitness progress over time through a clean, intuitive, and responsive UI.

## 🚀 Features

- **Authentication:** Secure user login and registration powered by [Clerk](https://clerk.com/).
- **Workout Logging:** Create and log workouts with multiple exercises.
- **Exercise Tracking:** Record sets, reps, and weights for various exercises.
- **Progress & Statistics:** Automatically calculate total workouts, total sets, total volume, and average volume per workout.
- **Personal Records (PRs):** Track your highest weight achievements across different muscle groups (Chest, Back, Legs, Shoulders, Arms, Abs).
- **Beautiful UI/UX:** Built with Tailwind CSS, featuring glassmorphism elements, dynamic gradients, and category-specific color coding.
- **Form Validation:** Robust client-side validation using React Hook Form and Zod.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Database / Backend:** [Supabase](https://supabase.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Forms:** React Hook Form & Zod
- **Notifications:** React Hot Toast
- **Icons:** React Icons

## ⚙️ Getting Started

### Prerequisites

Make sure you have Node.js (v18+) and npm/yarn/pnpm installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/gymforage.git
   cd gymforage
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your keys for Supabase and Clerk:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action.

## 🗄️ Database Structure

The project relies on Supabase for data management. Core tables include:
- `workouts`: Stores individual workout sessions (id, title, date, user_id).
- `exercise`: A dictionary of available exercises (id, name, category).
- `workouts_exercises`: A junction table linking workouts and exercises.
- `sets`: Stores the reps and weight for each exercise performed in a workout.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

