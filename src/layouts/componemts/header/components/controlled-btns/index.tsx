import style from './module.less';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import store from '@/store';
import { joinClass } from '@/utils/array';

function ControlledBtns() {

	const btns = store.getState().controlledBtns;
	const [ btnList, setBtnList ] = useState([]);

  useEffect(() => {
    const arr = Object.assign([], Object.values(btns));
    arr.sort((a: any, b: any) => b.count - a.count);
    setBtnList(arr);
  }, [btns]);

	return (<ul className={joinClass(style.controlledBtns, 'clearfix')}>
		{btnList.map((val: any, index) => <li key={index}>
      {val.element}
    </li>)}
	</ul>)
}


const hoc = connect(() => store.getState());
export default hoc(ControlledBtns);