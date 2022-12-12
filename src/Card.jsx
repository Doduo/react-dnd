import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { CARD } from "./ItemTypes";
const style = {
  backgroundColor: "red",
  padding: "5px",
  margin: "5px",
  border: "1px dashed gray",
  cursor: "move",
};

/**

 * 
 * @param {*} param0 
 * @returns 
 */
export default function Card({ id, text, index, moveCard }) {
  /**
   * {current:null}
   * div生成真实DOM后，会把DOM赋给ref.current
   */
  let ref = useRef();

  let [, drop] = useDrop({
    accept: CARD, // 一个字符串，这个放置目标只会对指定类型的拖动源发生反应
    collect: () => ({}),
    hover(item, monitor) {
      // 获取被拖动的卡片的索引 0
      const dragIndex = item.index;
      // 当前正在hover卡片的索引 1
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const { top, bottom } = ref.current.getBoundingClientRect();
      const halfOfHoverHeight = (bottom - top) / 2;
      const { y } = monitor.getClientOffset(); // event.clientY
      const hoverClientY = y - top;
      if (
        (dragIndex < hoverIndex && hoverClientY > halfOfHoverHeight) ||
        (dragIndex > hoverIndex && hoverClientY < halfOfHoverHeight)
      ) {
        moveCard(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });

  /**
   * useDrag hook： 提供一种将组建作为拖动源链接到React Dnd系统中的方法
   * isDragging：指的是collect属性的返回值的解构属性（当前是否被拖动）
   * DragSource Ref: 拖动源连接器，连接你的真实DOM和React Dnd系统
   * useDrag: 对应的项目的拖动源  DragSource
   * useDrop：对应的项目叫放置目标 DropTarget
   */
  let [{ isDragging }, drag] = useDrag({
    type: CARD, // spec 规范或者说规格
    item: () => ({ id, index }), // item 是必须的，是一个函数或者对象，它是一个用于描述拖动源的普通js对象
    /**
     * collect：收集功能，用来收集属性的，返回一个js对象，并且返回值会合并到你的组件属性中
     * monitor（监听器）：里面存放的是一些拖动的状态，当拖动的状态发生变化时通知组件发生变化 重新获取属性并进行刷新组件
     */
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.1 : 1;
  drag(ref);
  drop(ref);
  return (
    <div ref={ref} style={{ ...style, opacity }}>
      {text}
    </div>
  );
}
