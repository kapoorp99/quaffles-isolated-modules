import { useEffect, useRef, useState } from "react";
import "../App.css";
import interact from 'interactjs';
import { showGuides$ } from "../customHooks/showGuides";

function Draggable() {
	const dropareaRef = useRef<HTMLDivElement>(null);
	const childRef = useRef<HTMLDivElement>(null);
	const topArrow = useRef<HTMLDivElement>(null);
	const leftArrow = useRef<HTMLDivElement>(null);
	const bottomArrow = useRef<HTMLDivElement>(null);
	const rightArrow = useRef<HTMLDivElement>(null);
	const arrowWidth = 2;
	function getCoords(elem: HTMLElement) {
		// crossbrowser version
		var box = elem.getBoundingClientRect();

		var body = document.body;
		var docEl = document.documentElement;

		var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		var scrollLeft =
			window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

		var clientTop = docEl.clientTop || body.clientTop || 0;
		var clientLeft = docEl.clientLeft || body.clientLeft || 0;

		var top = box.top + scrollTop - clientTop;
		var left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left, width: box.width, height: box.height };
	}
	const updateCoord = () => {
		if (
			dropareaRef.current &&
			childRef.current &&
			topArrow.current &&
			leftArrow.current &&
			bottomArrow.current &&
			rightArrow.current
		) {
			// get postion and height details
			const pos1 = getCoords(dropareaRef.current);
			const pos2 = getCoords(childRef.current);
			// draw top arrow
			topArrow.current.style.top = pos1.top + "px";
			topArrow.current.style.left =
				pos2.left + pos2.width / 2 - arrowWidth / 2 + "px";
			topArrow.current.style.height = pos2.top - pos1.top + "px";
			topArrow.current.style.width = arrowWidth + "px";
			// draw left arrow
			leftArrow.current.style.top =
				pos2.top + pos2.height / 2 - arrowWidth / 2 + "px";
			leftArrow.current.style.left = pos1.left + "px";
			leftArrow.current.style.width = pos2.left - pos1.left + "px";
			leftArrow.current.style.height = arrowWidth + "px";
			// draw bottom arrow
			bottomArrow.current.style.top = pos2.top + pos2.height + "px";
			bottomArrow.current.style.left =
				pos2.left + pos2.width / 2 - arrowWidth / 2 + "px";
			bottomArrow.current.style.height =
				pos1.height - (pos2.top - pos1.top + pos2.height) + "px";
			bottomArrow.current.style.width = arrowWidth + "px";
			// draw right arrow
			rightArrow.current.style.top =
				pos2.top + pos2.height / 2 - arrowWidth / 2 + "px";
			rightArrow.current.style.left = pos2.left + pos2.width + "px";
			rightArrow.current.style.width =
				pos1.left + pos1.width - (pos2.left + pos2.width) + "px";
			rightArrow.current.style.height = arrowWidth + "px";
		}
	}
	const handleMovementStats = (className: string) => {
		let elem = document.getElementsByClassName(className)[0];
		updateCoord()
		console.log(elem)
	}
	const handleDrag = () => {
		interact('.demo').draggable({
			onmove: (event) => {
				handleMovementStats('demo')
				const target = event.target;
				const dataX = target.getAttribute('data-x');
				const dataY = target.getAttribute('data-y');
				console.log(dataX, dataY)
				const initialX = parseFloat(dataX) || 0;
				const initialY = parseFloat(dataY) || 0;

				const deltaX = event.dx;
				const deltaY = event.dy;

				const newX = initialX + deltaX;
				const newY = initialY + deltaY;

				// target
				// 	.style
				// 	.transform = `translate(${newX}px, ${newY}px)`;
				target.style.top = `${newY}`;
				target.style.left = `${newX}`;

				target.setAttribute('data-x', newX);
				target.setAttribute('data-y', newY);
			}
		})
	}
	const [coordinates, setCoordinates] = useState({
		x: 0,
		y: 0,
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	})
	useEffect(() => {
		const guideSubject = showGuides$.subscribe({
			next: (v) => {
				console.log('test bs', v)
			}
		});
		handleDrag()
		showGuides$.next([1])
		return () => {
			guideSubject.unsubscribe();
		}
	}, [
		dropareaRef.current,
		childRef.current,
		topArrow.current,
		leftArrow.current,
		bottomArrow.current,
		rightArrow.current,
	]);
	return (
		<div className="editor">
			<section className="guides-container">
				<div className="arrow topArrow" ref={topArrow}></div>
				<div className="arrow leftArrow" ref={leftArrow}></div>
				<div className="arrow bottomArrow" ref={bottomArrow}></div>
				<div className="arrow rightArrow" ref={rightArrow}></div>
			</section>
			<div className="droparea" ref={dropareaRef}>
				<div className="child demo" ref={childRef}></div>
			</div>
		</div>
	);
}

export default Draggable;
