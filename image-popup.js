document.addEventListener('DOMContentLoaded', function() {
    // 创建弹出层元素
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'image-popup-overlay';
    
    const popupContainer = document.createElement('div');
    popupContainer.className = 'image-popup';
    
    const popupImage = document.createElement('img');
    popupContainer.appendChild(popupImage);
    
    const closeButton = document.createElement('div');
    closeButton.className = 'image-popup-close';
    closeButton.innerHTML = '×';
    
    popupOverlay.appendChild(popupContainer);
    popupOverlay.appendChild(closeButton);
    document.body.appendChild(popupOverlay);
    
    // 确保关闭按钮始终可点击
    closeButton.style.position = 'fixed';
    closeButton.style.zIndex = '10001';
    
    // 检测设备类型
    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    // 检测鸿蒙系统 - 通常在UA中包含HarmonyOS或HUAWEI关键词
    const isHarmonyOS = /HarmonyOS/i.test(userAgent) || (/HUAWEI/i.test(userAgent) && /Android/i.test(userAgent));
    // 使用统一变量表示需要特殊处理的系统
    const needsSpecialHandling = isAndroid || isHarmonyOS;
    
    // 图片平移和缩放相关变量
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let lastDistance = 0;
    let isZooming = false;
    let initialScale = 1;
    let isPanning = false; // 新增：标记是否正在平移图片
    let lastTouchX = 0; // 新增：最后触摸的X坐标
    let lastTouchY = 0; // 新增：最后触摸的Y坐标
    let initialTranslateX = 0; // 新增：初始X平移值
    let initialTranslateY = 0; // 新增：初始Y平移值
    
    // 在文档加载时添加body class，用于样式优化
    document.body.classList.add('js-enabled');
    
    // 显示图片弹窗的函数
    function showImagePopup(src, alt) {
        // 设置图片源和替代文本
        popupImage.src = src;
        popupImage.alt = alt || '';
        
        // 保存当前滚动位置
        const scrollY = window.scrollY;
        
        // 显示弹窗
        popupOverlay.style.display = 'block';
        document.body.classList.add('popup-open');
        
        // 固定body并保持滚动位置
        document.body.style.position = 'fixed';
        document.body.style.top = -scrollY + 'px';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        
        // 重置缩放和平移
        scale = 1;
        translateX = 0;
        translateY = 0;
        popupImage.style.transform = "translate(0px, 0px) scale(1)";
        
        // 如果是安卓或鸿蒙设备，增加更多防护措施
        if (needsSpecialHandling) {
            // 添加历史记录状态，使浏览器认为当前是新页面
            // 这样滑动返回手势会先关闭弹窗而不是返回上一页
            history.pushState({popup: true, scrollY: scrollY}, '', window.location.href);
        }
    }
    
    // 为所有图片添加点击查看大图功能，但排除带有data-popup="false"的图片
    const images = document.querySelectorAll('img:not([data-popup="false"])');
    images.forEach(img => {
        // 只处理那些没有被标记为不弹出的图片
        if (img.getAttribute('data-popup') !== 'false') {
            // 添加清晰的视觉提示
            img.setAttribute('data-popup', 'true');
            
            // 添加点击事件
            img.addEventListener('click', function() {
                showImagePopup(this.src, this.alt);
            });
        }
    });
    
    // 更新图片变换
    function updateImageTransform() {
        // 直接设置transform样式，省略中间变量和字符串模板计算
        popupImage.style.transform = "translate(" + translateX + "px, " + translateY + "px) scale(" + scale + ")";
    }
    
    // 关闭弹出层
    function closePopup() {
        popupOverlay.style.display = 'none';
        document.body.classList.remove('popup-open');
        
        // 恢复body正常滚动
        const scrollY = document.body.style.top ? parseInt(document.body.style.top) * -1 : 0;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // 恢复滚动位置
        window.scrollTo(0, scrollY);
        
        // 重置图片位置和透明度
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupOverlay.style.opacity = '1';
        
        // 重置缩放和平移
        scale = 1;
        translateX = 0;
        translateY = 0;
        popupImage.style.transform = "translate(0px, 0px) scale(1)";
        
        // 如果是安卓或鸿蒙设备，且有弹窗历史状态，返回前一个状态
        if (needsSpecialHandling && history.state && history.state.popup) {
            history.back();
        }
    }
    
    closeButton.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
    
    // 添加键盘事件支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popupOverlay.style.display === 'block') {
            closePopup();
        }
    });
    
    // 处理安卓和鸿蒙设备的历史记录事件
    if (needsSpecialHandling) {
        window.addEventListener('popstate', function(e) {
            // 如果弹出层正在显示，则关闭它
            if (popupOverlay.style.display === 'block') {
                popupOverlay.style.display = 'none';
                document.body.classList.remove('popup-open');
                
                // 恢复body正常滚动
                let historyScrollY = 0;
                if (e.state && e.state.scrollY) {
                    historyScrollY = e.state.scrollY;
                } else if (document.body.style.top) {
                    historyScrollY = parseInt(document.body.style.top) * -1;
                }
                
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                
                // 恢复滚动位置
                window.scrollTo(0, historyScrollY);
                
                // 重置图片位置和透明度
                popupContainer.style.transform = 'translate(-50%, -50%)';
                popupOverlay.style.opacity = '1';
                
                // 重置缩放和平移
                scale = 1;
                translateX = 0;
                translateY = 0;
                popupImage.style.transform = "translate(0px, 0px) scale(1)";
                
                // 阻止事件进一步传播
                e.stopPropagation();
                return false;
            }
        });
    }
    
    // 处理滑动关闭功能
    let startX, startY;
    let currentX, currentY;
    let isDragging = false;
    
    // 检测是否处于大图查看状态
    function isPopupActive() {
        return popupOverlay.style.display === 'block';
    }
    
    // 添加页面级触摸开始事件监听，用于捕获边缘滑动返回手势
    document.addEventListener('touchstart', function(e) {
        // 只在弹出层显示时处理
        if (!isPopupActive()) return;
        
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        
        // 检查是否是从左边缘开始的滑动(这通常是返回手势)
        // 对安卓和鸿蒙设备使用更大的边缘检测范围
        // 鸿蒙系统边缘滑动检测需要更敏感
        let edgeThreshold = 30; // 默认iOS值
        if (isAndroid) edgeThreshold = 50; // 安卓值
        if (isHarmonyOS) edgeThreshold = 70; // 鸿蒙值更大，因为有的华为手机边缘滑动区域较大
        
        const isLeftEdgeSwipe = startX < edgeThreshold;
        
        // 如果是边缘滑动且图片弹出层处于活动状态
        if (isLeftEdgeSwipe) {
            // 标记为正在拖动，防止触发浏览器默认行为
            isDragging = true;
            // 阻止默认行为，防止触发浏览器的导航
            e.preventDefault();
        }
    }, { passive: false });
    
    // 页面级触摸移动处理
    document.addEventListener('touchmove', function(e) {
        // 只在弹出层显示且正在拖动时处理
        if (!isPopupActive() || !isDragging) return;
        
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        
        // 计算水平和垂直移动距离
        const diffX = currentX - startX;
        const diffY = currentY - startY;
        
        // 对安卓和鸿蒙设备强制阻止任何形式的水平滑动
        if (needsSpecialHandling && Math.abs(diffX) > 10) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // 如果主要是水平滑动
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // 阻止默认行为
            e.preventDefault();
            
            // 只处理从左向右的滑动(通常的返回手势)
            if (diffX > 0) {
                // 移动图片容器，跟随手指
                popupContainer.style.transform = `translate(calc(-50% + ${diffX}px), -50%)`;
                
                // 根据移动距离调整透明度
                const opacity = 1 - Math.min(diffX / 200, 0.8);
                popupOverlay.style.opacity = opacity;
            }
        }
    }, { passive: false });
    
    // 页面级触摸结束处理
    document.addEventListener('touchend', function(e) {
        // 只在弹出层显示且正在拖动时处理
        if (!isPopupActive() || !isDragging) return;
        
        // 计算水平滑动距离 - 确保变量存在
        const finalTouchX = e.changedTouches[0].clientX;
        const finalDiffX = finalTouchX - startX;
        
        // 为不同设备设置不同的关闭阈值
        let threshold = 80; // 默认iOS值
        if (isAndroid) threshold = 50; // 安卓值
        if (isHarmonyOS) threshold = 40; // 鸿蒙值更小，使滑动更灵敏
        
        // 如果是向右滑动且距离足够(模拟返回手势)
        if (finalDiffX > threshold) {
            // 立即关闭，不使用动画
            closePopup();
        } else {
            // 立即恢复位置，不使用动画
            popupContainer.style.transform = 'translate(-50%, -50%)';
            popupOverlay.style.opacity = '1';
        }
        
        // 重置状态
        isDragging = false;
    });
    
    // 图片弹出层自身的触摸处理 - 支持平移和缩放
    popupOverlay.addEventListener('touchstart', function(e) {
        if (isDragging) return; // 如果已经在处理边缘滑动，则不再处理
        
        // 检测是否是双指触摸（用于缩放）
        if (e.touches.length === 2) {
            isZooming = true;
            // 计算两个触摸点之间的初始距离
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            lastDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            initialScale = scale;
        } else if (e.touches.length === 1) {
            // 单指触摸 - 用于平移
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            lastTouchX = startX; // 初始化最后触摸坐标
            lastTouchY = startY;
            initialTranslateX = translateX; // 保存当前的平移值
            initialTranslateY = translateY;
            isPanning = true; // 标记为正在平移
            
            // 阻止事件冒泡和默认行为
            e.stopPropagation();
            e.preventDefault();
        }
    }, { passive: false });
    
    popupOverlay.addEventListener('touchmove', function(e) {
        // 阻止默认行为 - 防止页面滚动
        e.preventDefault();
        
        // 处理缩放
        if (isZooming && e.touches.length === 2) {
            // 计算两个触摸点之间的当前距离
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            // 直接计算缩放比例和应用
            scale = Math.min(Math.max(initialScale * (currentDistance / lastDistance), 0.5), 5);
            
            // 直接应用变换，不使用函数调用
            popupImage.style.transform = "translate(" + translateX + "px, " + translateY + "px) scale(" + scale + ")";
        } 
        // 处理平移
        else if (isPanning && e.touches.length === 1) {
            // 直接获取当前触摸点
            const touch = e.touches[0];
            
            // 如果图片已放大，允许平移
            if (scale > 1) {
                // 直接计算新位置
                translateX = initialTranslateX + (touch.clientX - startX);
                translateY = initialTranslateY + (touch.clientY - startY);
                
                // 直接应用变换，不使用函数调用
                popupImage.style.transform = "translate(" + translateX + "px, " + translateY + "px) scale(" + scale + ")";
            } 
            // 如果图片未放大，则处理滑动关闭
            else {
                // 直接计算移动
                const deltaX = touch.clientX - startX;
                
                // 直接应用变换
                popupContainer.style.transform = "translate(calc(-50% + " + deltaX + "px), -50%)";
                popupOverlay.style.opacity = "0.5";
            }
        }
    }, { passive: false });
    
    popupOverlay.addEventListener('touchend', function(e) {
        // 重置状态
        isZooming = false;
        isPanning = false;
        
        // 如果图片未放大，处理滑动关闭
        if (scale <= 1 && e.changedTouches && e.changedTouches.length > 0) {
            // 直接获取触摸点
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;
            
            // 简化: 如果滑动足够长，关闭弹窗
            if (Math.abs(deltaX) > 50) {
                closePopup();
            } else {
                // 恢复位置
                popupContainer.style.transform = 'translate(-50%, -50%)';
                popupOverlay.style.opacity = '1';
            }
        }
    }, { passive: true });
}); 