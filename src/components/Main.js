require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关的数据
var imageDatas = require('../data/imageDatas.json');
//利用自执行函数，将图片信息转成图片Url路径信息
imageDatas = (function getImageUrl(imageDatasArr) {
	for(var i=0;i< imageDatasArr.length;i++){
		var singleImageData = imageDatasArr[i];
		singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

//获取区间内的一个随机值
function getRangeRandom(low,high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

//限制旋转角度在正负30°以内
function get30DegRandom() {
	return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}

var ImgFigure = React.createClass({
	//ImgFigure的点击处理函数
	handleClick: function(e) {

		if(this.props.arrange.isCenter) {
			this.props.inverse();
		}else {
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	},

	render: function() {

		var styleObj = {};

		//如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		//如果图片的旋转角度有值且不为0，添加旋转角度
		if(this.props.arrange.rotate) {
			['MozTransform', 'msTransform', 'WebkitTransform', 'transform'].forEach(function(value){
				styleObj[value] = 'rotate('+this.props.arrange.rotate +'deg)';
			}.bind(this));
		}

		//居中的图片z-index提高，避免被遮挡
		if(this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}

		//图片翻转
		var imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isReverse ? ' is-inverse': '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageUrl} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.description}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
});

//控制组件,变量首字母必须大写，否则会被检测成html标签
var ControllerUnit = React.createClass({

	handleClick: function(e) {

		//如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
		if(this.props.arrange.isCenter) {
			this.props.inverse();
		}else {
			this.props.center();
		}

		e.stopPropagation;
		e.preventDefault;
	},


	render: function() {

		var controllerUnitClassName = 'controller-unit';

		//如果对应的是居中的图片，显示控制按钮的居中态
		if(this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center';

			//如果同时对应的是翻转图片，显示控制按钮的翻转态
			if(this.props.arrange.isReverse) {
				controllerUnitClassName += ' is-inverse';
			}
		}

		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}></span>
		);
	}
});

/*
class AppComponent extends React.Component {
  render() {
    return (
    	<section className="stage">
    		<section className="img-sec">

    		</section>
    		<nav className="controller-nav">

    		</nav>
    	</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
*/
var AppComponent = React.createClass({
	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: {//水平方向的取值范围
			leftSecX: [0,0],
			rightSecX: [0,0],
			y: [0,0]
		},
		vPosRange: {//垂直方向的取值范围
			x: [0,0],
			topY: [0,0]
		}
	},

	/*
	*	翻转图片
	*	@param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	*	return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
	*/
	inverse: function(index) {
		return function() {
			var imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isReverse = !imgsArrangeArr[index].isReverse;

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});

		}.bind(this);
	},

	/*
	*	重新布局所有图片
	*	@param centerIndex 指定居中哪个图片
	*/
	rearrange: function(centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random()*2),
			//取一个或者不取
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

			//首先居中centerIndex的图片,图片不需要旋转
			imgsArrangeCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				isCenter: true
			}

			//取出要布局上侧的图片的状态信息
			topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
debugger;
			//布局位于上侧的图片
			imgsArrangeTopArr.forEach(function(value,index){
				imgsArrangeTopArr[index] = {
					pos: {
						top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			});

			//布局左右两侧的图片
			for(var i=0, j = imgsArrangeArr.length, k=j / 2; i < j; i++){
				var hPosRangeLORX = null;

				//前半部分布局左边，后半部分布局右边
				if(i < k){
					hPosRangeLORX = hPosRangeLeftSecX;
				}else {
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos: {
						top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			}

			if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
			//state状态改变，触发react的重新渲染
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
	},

	/*
	*	利用rearrange函数，居中对应index的图片
	*	@param index，需要被居中的图片对应的图片信息数组的index值
	*	@return {Function}
	*/
	center: function(index) {
		return function() {
			this.rearrange(index);
		}.bind(this);
	},

	getInitialState: function() {
		return {
			imgsArrangeArr: [
				/*{
					pos: {
						left: '0',
						top: '0'
					},
					rotate: 0, //图片旋转角度
					isReverse: false, //图片正反面，false:正面
					isCenter: false, //图片是否居中
				}*/
			]
		};
	},

	//组件加载以后，为每张图片计算其位置的范围
	componentDidMount: function() {
		//首先拿到舞台的大小
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);
		//拿到一个imgFigure的大小
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		//计算中心图片的位置
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}
		//计算左侧、右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = - halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		//计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = - halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

		this.rearrange(0);

	},

	render: function() {

		var controllerUnits = [],
			ImgFigures = [];

		imageDatas.forEach(function(value, index){

			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isReverse: false,
					isCenter: false
				}
			}
			//key={index}，优化react的性能
			ImgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		}.bind(this));//bind(this)是使内部可以调用外部的this。外部的this指向react对象，forEach里的this原本指向window？

		return (
	    	<section className="stage" ref="stage">
	    		<section className="img-sec">
	    			{ImgFigures}
	    		</section>
	    		<nav className="controller-nav">
	    			{controllerUnits}
	    		</nav>
	    	</section>
    	);
	}
});

module.exports = AppComponent;