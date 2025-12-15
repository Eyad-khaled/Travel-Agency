
const InfoPill = ({title, image}) => {
  return (
    <figure className="info-pill max-w-full overflow-hidden">
      <img src={image} alt={title} />
      <figcaption>{title}</figcaption>
    </figure>
  );
};

export default InfoPill;
