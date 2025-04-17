export default function Card({ children, className = "" }) {
  return <div className={`overflow-hidden rounded-lg bg-white p-5 shadow ${className}`}>{children}</div>
}
