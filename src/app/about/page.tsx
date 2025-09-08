import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Your Name",
  description: "Learn more about me and my journey.",
};

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Me</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-6">
            Welcome to my personal space on the web. This is where I share my
            thoughts, experiences, and the things that inspire me.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Background
              </h2>
              <p className="text-gray-600">
                Add your background story here. Talk about your profession,
                interests, and what drives you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Interests
              </h2>
              <ul className="text-gray-600 space-y-2">
                <li>• Photography</li>
                <li>• Technology</li>
                <li>• Writing</li>
                <li>• Travel</li>
              </ul>
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
