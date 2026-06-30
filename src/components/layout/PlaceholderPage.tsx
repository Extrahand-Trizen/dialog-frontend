import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Screen scaffold is ready. Implementation coming in the next sprint.
        </p>
      </CardContent>
    </Card>
  );
}
