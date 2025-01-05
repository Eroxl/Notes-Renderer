type PageMetadataProps = {
  metadata: Record<string, unknown>,
};

const PageMetadataEntry: React.FC<{ value: unknown }> = (props) => {
  const { value } = props;

  if (!Array.isArray(value)) {
    return value.toString()
  }

  return value
    .map((entry) => entry.toString())
    .join(", ")
}

const PageMetadata: React.FC<PageMetadataProps> = (props) => {
  const { metadata } = props;

  return (
    <div>
      {
        Object.entries(metadata).map(([key, value]) => {
          return (
            <div className="flex flex-row py-4 gap-8">
              <div className="text-[#9eafcc]">
                {key}
              </div>
              <PageMetadataEntry value={value} />
            </div>
          )
        })
      }
    </div>
  )
};

export default PageMetadata;
