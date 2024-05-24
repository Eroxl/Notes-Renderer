import TextNode from "src/lib/types/TextNode";
import { LucideProps, Pencil, AlertTriangle } from 'lucide-react';

const calloutStyles = {
  note: {
    colour: "129, 161, 193",
    icon: Pencil,
  },
  warning: {
    colour: "208, 138, 112",
    icon: AlertTriangle,
  }
} as Record<string, {colour: string, icon: React.FC<LucideProps>}>;

const Callout: React.FC<{ node: TextNode}> = (props) => {
  const { node } = props;

  const calloutStyle = calloutStyles[(node.properties['type'] as string).toLowerCase()] || calloutStyles.note

  return (
    <div
      className="overflow-hidden rounded-md my-4 mix-blend-lighten p-6 pt-3"
      style={{
        backgroundColor: `rgba(${calloutStyle.colour}, 0.1)`
      }}
      data-callout-type={(node.properties['type'] as string).toLowerCase()}
    >
      <div
        className="font-bold text-[1.1rem] pb-3 flex flex-row gap-2"
        style={{
          color: `rgb(${calloutStyle.colour})`
        }}
      >
        <calloutStyle.icon
          className="w-[1em] h-[1em] my-auto"
        />
        {node.properties['title'] as string || (node.properties['type'] as string)}
      </div>

      <div>
        {node.properties['content'] as string}
      </div>
    </div>
  )
}

export default Callout;
