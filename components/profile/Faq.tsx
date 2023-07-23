import { useState, useEffect } from 'react';
import { initalFaqLists } from '../../constants/mockData';
import { apis } from '../../apis';
import NestedListWithCollabse from './NestedListWithCollabse';

const Faq = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await apis.faq.getList();

      const sortedMap = {};
      data.forEach((item) => {
        const { id, attributes } = item;
        const { type, title, description } = attributes;
        if (!sortedMap[type]) {
          sortedMap[type] = [];
        }
        sortedMap[type].push(item);
      });

      const sorted = Object.keys(sortedMap).reduce((acc, key) => {
        acc.push(...sortedMap[key]);
        return acc;
      }, []);

      setList(
        sorted.reduce((acc, val, i) => {
          const prev = i === 0 || acc.length === 0 ? null : acc[i - 1];
          let isFirstInTypeGroup = false;

          if (!prev || prev.relatedType !== val.attributes.type) {
            isFirstInTypeGroup = true;
          }
          acc.push({
            id: val.id,
            relatedType: val.attributes.type,
            title: val.attributes.title,
            description: val.attributes.description,
            isFirstInTypeGroup,
          });
          return acc;
        }, [])
      );
    })();
  }, []);

  const handleClick = (id: string) => {
    // 해당하는 아이템의 isOpened 상태를 바꿔준다.
    // 해당하지 않는 아이템은 모두 닫아준다(isOpened = false)
    const newList = list.map((item) => {
      if (item.id == id) {
        item.isOpened = !item.isOpened;
      } else {
        item.isOpened = false;
      }

      return item;
    });

    setList(newList);
  };

  return (
    <NestedListWithCollabse type="faq" list={list} onClickList={handleClick} />
  );
};

export default Faq;
