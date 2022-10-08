import style from './module.less';
import PropTypes from 'prop-types';
import { Link } from 'umi';

export default function SkillItem(props) {
  return (<div className={style.skillItem}>
    <h2 className={style.title}>
      <a href={props.link} target='_blank'>{props.title}</a>
    </h2>
    <p>{props.introduce}</p>
  </div>)
}

SkillItem.propTypes = {
  title: PropTypes.string,
  introduce: PropTypes.string,
  link: PropTypes.string,
}