import './Card.css'

const Card = ({ title, description }) => {
  return (
    <article className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

export default Card
