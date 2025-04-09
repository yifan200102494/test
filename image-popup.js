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
    
    // 为所有图片添加点击事件
    document.querySelectorAll('img').forEach(img => {
        // 排除已经在弹出层中的图片
        if (!img.closest('.image-popup')) {
            img.setAttribute('data-popup', 'true');
            img.addEventListener('click', function(e) {
                e.preventDefault();
                popupImage.src = this.src;
                popupOverlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // 重置缩放和平移
                scale = 1;
                translateX = 0;
                translateY = 0;
                updateImageTransform();
                
                // 如果是安卓或鸿蒙设备，增加更多防护措施
                if (needsSpecialHandling) {
                    // 添加历史记录状态，使浏览器认为当前是新页面
                    // 这样滑动返回手势会先关闭弹窗而不是返回上一页
                    history.pushState({popup: true}, '', window.location.href);
                }
            });
        }
    });
    
    // 更新图片变换
    function updateImageTransform() {
        popupImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
    
    // 关闭弹出层
    function closePopup() {
        popupOverlay.style.display = 'none';
        document.body.style.overflow = '';
        // 重置图片位置和透明度
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupOverlay.style.opacity = '1';
        
        // 重置缩放和平移
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateImageTransform();
        
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
                document.body.style.overflow = '';
                popupContainer.style.transform = 'translate(-50%, -50%)';
                popupOverlay.style.opacity = '1';
                
                // 重置缩放和平移
                scale = 1;
                translateX = 0;
                translateY = 0;
                updateImageTransform();
                
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
        
        // 计算水平滑动距离
        const finalDiffX = currentX - startX;
        
        // 为不同设备设置不同的关闭阈值
        let threshold = 80; // 默认iOS值
        if (isAndroid) threshold = 50; // 安卓值
        if (isHarmonyOS) threshold = 40; // 鸿蒙值更小，使滑动更灵敏
        
        // 如果是向右滑动且距离足够(模拟返回手势)
        if (finalDiffX > threshold) {
            // 添加滑出动画
            popupContainer.style.transition = 'transform 0.3s ease-out';
            popupOverlay.style.transition = 'opacity 0.3s ease-out';
            
            popupContainer.style.transform = `translate(calc(-50% + ${window.innerWidth}px), -50%)`;
            popupOverlay.style.opacity = '0';
            
            // 动画结束后关闭
            setTimeout(closePopup, 300);
        } else {
            // 未达到关闭阈值，恢复位置
            popupContainer.style.transition = 'transform 0.3s ease-out';
            popupOverlay.style.transition = 'opacity 0.3s ease-out';
            popupContainer.style.transform = 'translate(-50%, -50%)';
            popupOverlay.style.opacity = '1';
            
            // 重置过渡效果
            setTimeout(() => {
                popupContainer.style.transition = '';
                popupOverlay.style.transition = '';
            }, 300);
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
            isDragging = true;
        }
        
        // 在安卓和鸿蒙设备上阻止更多的事件传播
        if (needsSpecialHandling) {
            e.stopPropagation();
        }
    }, needsSpecialHandling ? { passive: false } : { passive: true });
    
    popupOverlay.addEventListener('touchmove', function(e) {
        // 处理缩放
        if (isZooming && e.touches.length === 2) {
            e.preventDefault();
            
            // 计算两个触摸点之间的当前距离
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const currentDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            // 计算缩放比例
            const scaleFactor = currentDistance / lastDistance;
            scale = Math.min(Math.max(initialScale * scaleFactor, 0.5), 5);
            
            // 更新图片变换
            updateImageTransform();
        } 
        // 处理平移
        else if (isDragging && e.touches.length === 1) {
            e.preventDefault();
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            // 计算水平和垂直移动距离
            const diffX = currentX - startX;
            const diffY = currentY - startY;
            
            // 如果图片已放大，允许平移
            if (scale > 1) {
                // 计算新的平移值，并限制在合理范围内
                const maxTranslate = (popupImage.offsetWidth * scale - popupImage.offsetWidth) / 2;
                translateX = Math.min(Math.max(translateX + diffX, -maxTranslate), maxTranslate);
                translateY = Math.min(Math.max(translateY + diffY, -maxTranslate), maxTranslate);
                
                // 更新图片变换
                updateImageTransform();
                
                // 更新起始位置，以便下一次移动
                startX = currentX;
                startY = currentY;
            } 
            // 如果图片未放大，则处理滑动关闭
            else {
                // 在安卓和鸿蒙设备上阻止默认行为
                if (needsSpecialHandling) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                // 移动图片容器，跟随手指
                const translateX = diffX;
                popupContainer.style.transform = `translate(calc(-50% + ${translateX}px), -50%)`;
                
                // 根据移动距离调整透明度
                const opacity = 1 - Math.min(Math.abs(diffX) / 200, 0.8);
                popupOverlay.style.opacity = opacity;
            }
        }
    }, needsSpecialHandling ? { passive: false } : { passive: true });
    
    popupOverlay.addEventListener('touchend', function(e) {
        // 重置缩放状态
        if (isZooming) {
            isZooming = false;
        }
        
        // 处理平移结束
        if (isDragging) {
            // 如果图片未放大，处理滑动关闭
            if (scale <= 1) {
                // 计算最终移动距离
                const finalDiffX = currentX - startX;
                
                // 为不同设备设置不同的关闭阈值
                let threshold = 100; // 默认iOS值
                if (isAndroid) threshold = 70; // 安卓值
                if (isHarmonyOS) threshold = 60; // 鸿蒙值
                
                // 如果水平滑动距离超过临界值，关闭弹出层
                if (Math.abs(finalDiffX) > threshold) {
                    const direction = finalDiffX > 0 ? 1 : -1;
                    
                    // 添加滑出动画
                    popupContainer.style.transition = 'transform 0.3s ease-out';
                    popupOverlay.style.transition = 'opacity 0.3s ease-out';
                    
                    popupContainer.style.transform = `translate(calc(-50% + ${direction * window.innerWidth}px), -50%)`;
                    popupOverlay.style.opacity = '0';
                    
                    // 动画结束后关闭
                    setTimeout(closePopup, 300);
                } else {
                    // 未达到关闭阈值，恢复位置
                    popupContainer.style.transition = 'transform 0.3s ease-out';
                    popupOverlay.style.transition = 'opacity 0.3s ease-out';
                    popupContainer.style.transform = 'translate(-50%, -50%)';
                    popupOverlay.style.opacity = '1';
                    
                    // 重置过渡效果
                    setTimeout(() => {
                        popupContainer.style.transition = '';
                        popupOverlay.style.transition = '';
                    }, 300);
                }
            }
            
            // 重置拖动状态
            isDragging = false;
        }
        
        // 在安卓和鸿蒙设备上阻止更多的事件传播
        if (needsSpecialHandling) {
            e.stopPropagation();
        }
    });
    
    // 添加双击放大/缩小功能
    popupImage.addEventListener('dblclick', function() {
        if (scale > 1) {
            // 如果已放大，则缩小
            scale = 1;
            translateX = 0;
            translateY = 0;
        } else {
            // 如果未放大，则放大
            scale = 2;
        }
        updateImageTransform();
    });
}); 