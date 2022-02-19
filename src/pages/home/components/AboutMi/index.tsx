import { Link } from "umi"


export default ({ list = [] }) => {
  return <div>
    <ul>{list.map((val, index: number) => <li key={index}>
      <Link to={val.link}>
        <h3>{val.title}</h3>
        <p>{val.introduce}</p>
      </Link>
    </li>)}</ul>
  </div>
}