export default function Slide({ data: { url, title } }) {
  return (
    <div className="slide">
      <div className="slide-title">{title}</div>
      <img src={url} alt={title} className="slide-image" />;
    </div>
  )
}
