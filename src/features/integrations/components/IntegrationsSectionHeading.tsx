type IntegrationsSectionHeadingProps = {
  title: string;
  description?: string;
};

export function IntegrationsSectionHeading({ title, description }: IntegrationsSectionHeadingProps) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
