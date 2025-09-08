import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Progress,
  Separator,
  Alert,
  AlertDescription,
  PageHeader,
  GridContainer,
  IconBox,
  SectionContainer,
  AnimatedCounter,
  GradientText,
  LoadingSpinner,
  EmptyState,
  StatsCard,
  Timeline,
} from "@/components/ui";
import { FeatureCard, BlogCard } from "@/components/common";
import {
  Camera,
  Code,
  Heart,
  Star,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";

export default function ComponentsDemo() {
  const timelineItems = [
    {
      id: "1",
      title: "Started Learning React",
      description: "Began my journey with React and modern web development",
      date: "January 2023",
      status: "completed" as const,
      tags: ["React", "JavaScript"],
    },
    {
      id: "2",
      title: "Built First Portfolio",
      description: "Created my first personal website using Next.js",
      date: "March 2023",
      status: "completed" as const,
      tags: ["Next.js", "Portfolio"],
    },
    {
      id: "3",
      title: "Learning TypeScript",
      description:
        "Currently expanding skills with TypeScript and advanced patterns",
      date: "December 2024",
      status: "in-progress" as const,
      tags: ["TypeScript", "Learning"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SectionContainer>
        <PageHeader
          title="Components Showcase"
          description="A comprehensive demo of all available UI components and their variants"
          badge="Demo"
        />

        <Tabs defaultValue="basic" className="mt-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic UI</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-8 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Components</CardTitle>
                <CardDescription>Fundamental UI elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Buttons */}
                <div>
                  <h4 className="font-semibold mb-3">Buttons</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                <Separator />

                {/* Badges */}
                <div>
                  <h4 className="font-semibold mb-3">Badges</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>

                <Separator />

                {/* Progress */}
                <div>
                  <h4 className="font-semibold mb-3">Progress</h4>
                  <Progress value={65} className="w-60" />
                  <p className="text-sm text-muted-foreground mt-1">
                    65% complete
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-8 mt-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Card Components</h3>

              <GridContainer columns={3} className="mb-8">
                <FeatureCard
                  icon={<Camera className="w-6 h-6" />}
                  title="Photography"
                  description="Capturing beautiful moments and stories through photography"
                  href="/photos"
                  badge="Featured"
                />
                <FeatureCard
                  icon={<Code className="w-6 h-6" />}
                  title="Development"
                  description="Building modern web applications with latest technologies"
                  href="/projects"
                />
                <FeatureCard
                  icon={<FileText className="w-6 h-6" />}
                  title="Writing"
                  description="Sharing thoughts and experiences through blog posts"
                  href="/blog"
                />
              </GridContainer>

              <GridContainer columns={2} className="mb-8">
                <BlogCard
                  title="Getting Started with Next.js"
                  excerpt="Learn how to build modern web applications with Next.js and React"
                  date="2024-01-15"
                  readTime="5 min read"
                  slug="getting-started-nextjs"
                  tags={["Next.js", "React", "Tutorial"]}
                  featured
                />
                <BlogCard
                  title="TypeScript Best Practices"
                  excerpt="Essential TypeScript patterns and practices for better code quality"
                  date="2024-01-10"
                  readTime="8 min read"
                  slug="typescript-best-practices"
                  tags={["TypeScript", "Best Practices"]}
                />
              </GridContainer>

              <GridContainer columns={4}>
                <StatsCard
                  title="Blog Posts"
                  value={24}
                  description="Published articles"
                  icon={<FileText className="w-4 h-4" />}
                  trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                  title="Photos"
                  value={156}
                  description="Gallery images"
                  icon={<Camera className="w-4 h-4" />}
                />
                <StatsCard
                  title="Projects"
                  value={8}
                  description="Completed works"
                  icon={<Code className="w-4 h-4" />}
                  trend={{ value: 5, isPositive: false }}
                />
                <StatsCard
                  title="Followers"
                  value={1247}
                  description="Social media"
                  icon={<Users className="w-4 h-4" />}
                  trend={{ value: 23, isPositive: true }}
                />
              </GridContainer>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-8 mt-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Custom UI Elements
              </h3>

              <GridContainer columns={2} className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Icon Boxes</CardTitle>
                    <CardDescription>
                      Different styles and variants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <IconBox icon={<Heart />} variant="primary" />
                      <IconBox icon={<Star />} variant="secondary" />
                      <IconBox icon={<TrendingUp />} variant="success" />
                      <IconBox icon={<Camera />} variant="warning" size="lg" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gradient Text</CardTitle>
                    <CardDescription>Eye-catching text effects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <GradientText
                      gradient="primary"
                      className="text-2xl font-bold"
                    >
                      Primary Gradient
                    </GradientText>
                    <GradientText
                      gradient="rainbow"
                      className="text-xl font-semibold"
                    >
                      Rainbow Effect
                    </GradientText>
                    <GradientText gradient="sunset" className="text-lg">
                      Sunset Colors
                    </GradientText>
                  </CardContent>
                </Card>
              </GridContainer>

              <Card>
                <CardHeader>
                  <CardTitle>Animated Counters</CardTitle>
                  <CardDescription>
                    Numbers that animate on load
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <AnimatedCounter value={1247} className="text-3xl" />
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <AnimatedCounter
                        value={89}
                        suffix="%"
                        className="text-3xl"
                      />
                      <p className="text-sm text-muted-foreground">
                        Satisfaction
                      </p>
                    </div>
                    <div>
                      <AnimatedCounter value={156} className="text-3xl" />
                      <p className="text-sm text-muted-foreground">Projects</p>
                    </div>
                    <div>
                      <AnimatedCounter
                        value={24}
                        suffix="k"
                        className="text-3xl"
                      />
                      <p className="text-sm text-muted-foreground">Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loading States</CardTitle>
                  <CardDescription>
                    Loading spinners in different sizes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <LoadingSpinner size="sm" />
                    <LoadingSpinner size="md" />
                    <LoadingSpinner size="lg" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Small, Medium, and Large loading spinners
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-8 mt-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">
                Advanced Components
              </h3>

              <Timeline items={timelineItems} className="mb-8" />

              <GridContainer columns={2}>
                <EmptyState
                  icon={<FileText className="w-12 h-12" />}
                  title="No content yet"
                  description="This is how empty states look with call-to-action buttons"
                  action={{
                    label: "Create Content",
                    onClick: () => alert("Create action clicked!"),
                  }}
                />

                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    This is an alert component with an icon. Perfect for
                    notifications and important messages.
                  </AlertDescription>
                </Alert>
              </GridContainer>
            </div>
          </TabsContent>
        </Tabs>
      </SectionContainer>
    </div>
  );
}
