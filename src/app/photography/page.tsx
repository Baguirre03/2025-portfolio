export default function PhotographyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[40vh] items-center justify-center bg-background">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-balance text-4xl font-light tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Photography
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            A collection of moments captured through my lens, exploring
            minimalism and composition.
          </p>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src="/minimal-workspace-setup-with-laptop-and-coffee.jpg"
                alt="Workspace"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src="/bw-architecture.png"
                alt="Architecture"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src="/minimalist-nature-landscape-black-and-white.jpg"
                alt="Nature"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src="/urban-street-photography-monochrome.jpg"
                alt="Street"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src="/abstract-geometric-patterns-black-white.jpg"
                alt="Abstract"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src="/minimalist-portrait-photography.jpg"
                alt="Portrait"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src="/technology-devices-minimal-composition.jpg"
                alt="Technology"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src="/coffee-and-books-minimal-flat-lay.jpg"
                alt="Lifestyle"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="text-center">
            <p className="text-sm leading-5 text-muted-foreground">
              © 2024 Portfolio. Built with modern web technologies and best
              practices.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
