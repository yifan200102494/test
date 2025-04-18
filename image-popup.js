document.addEventListener('DOMContentLoaded', function() {
    // 创建弹出层元素
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'image-popup-overlay';
    
    const popupContainer = document.createElement('div');
    popupContainer.className = 'image-popup';
    
    const popupImage = document.createElement('img');
    popupContainer.appendChild(popupImage);
    
    // 关闭按钮 - 直接使用HTML创建确保样式正确应用
    const closeButton = document.createElement('div');
    closeButton.className = 'image-popup-close';
    closeButton.innerHTML = ''; // 移除内容，完全通过CSS ::before伪元素显示
    closeButton.setAttribute('style', 'position: fixed; top: 20px; right: 20px; color: #fff; font-size: 36px; cursor: pointer; z-index: 10001; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background-color: rgba(0, 0, 0, 0.5); border-radius: 50%;');
    
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
        
        // 先固定文档，防止背景滚动和闪烁
        document.documentElement.classList.add('popup-open');
        document.body.classList.add('popup-open');
        document.documentElement.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = -scrollY + 'px';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        
        // 确保弹出层样式正确 - 使用内联样式避免CSS覆盖问题
        popupOverlay.style.display = 'block';
        popupOverlay.style.backgroundColor = '#000000';
        popupOverlay.style.opacity = '1';
        popupOverlay.style.zIndex = '2147483647';
        popupOverlay.style.position = 'fixed';
        popupOverlay.style.top = '0';
        popupOverlay.style.left = '0';
        popupOverlay.style.right = '0';
        popupOverlay.style.bottom = '0';
        popupOverlay.style.width = '100vw';
        popupOverlay.style.height = '100vh';
        
        // 设置容器样式
        popupContainer.style.width = '100vw';
        popupContainer.style.height = '100vh';
        popupContainer.style.maxWidth = '100vw';
        popupContainer.style.maxHeight = '100vh';
        popupContainer.style.display = 'flex';
        popupContainer.style.justifyContent = 'center';
        popupContainer.style.alignItems = 'center';
        
        // 设置图片样式
        popupImage.style.maxWidth = '100vw';
        popupImage.style.maxHeight = '100vh';
        popupImage.style.width = 'auto';
        popupImage.style.height = 'auto';
        popupImage.style.objectFit = 'contain';
        
        // 确保关闭按钮显示在顶部，防止被遮挡
        closeButton.style.display = 'flex';
        closeButton.style.visibility = 'visible';
        closeButton.style.opacity = '1';
        closeButton.style.zIndex = '2147483647';
        
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
        
        // 禁用页面所有其他元素的交互
        document.querySelectorAll('body > *:not(.image-popup-overlay)').forEach(element => {
            if (element !== popupOverlay) {
                element.setAttribute('aria-hidden', 'true');
                if (element.style.zIndex) {
                    element.setAttribute('data-original-zindex', element.style.zIndex);
                }
                element.style.zIndex = '-1';
            }
        });
    }
    
    // 为所有图片添加点击查看大图功能，但排除带有data-popup="false"的图片
    function addImagePopupListeners() {
        const images = document.querySelectorAll('img:not([data-popup="false"])');
        images.forEach(img => {
            // 只处理那些没有被标记为不弹出的图片
            if (img.getAttribute('data-popup') !== 'false' && !img.hasAttribute('data-popup-initialized')) {
                // 添加清晰的视觉提示
                img.setAttribute('data-popup', 'true');
                img.setAttribute('data-popup-initialized', 'true');
                
                // 添加点击事件
                img.addEventListener('click', function() {
                    // 如果是LOGO图片（根据alt或src判断），直接跳转到主页而不显示弹窗
                    if (this.alt === 'Logo' || this.src.includes('/logo') || this.parentElement.closest('.logo')) {
                        // 如果已经在index页面，只是重新加载
                        if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
                            window.location.reload();
                        } else {
                            // 否则跳转到index页面
                            window.location.href = 'index.html';
                        }
                        return; // 阻止弹窗显示
                    }
                    // 其他图片正常显示弹窗
                    showImagePopup(this.src, this.alt);
                });
            }
        });
    }
    
    // 初始化时调用一次
    addImagePopupListeners();
    
    // 为剧本弹出层中的图片添加点击事件
    function addPopupImagesListener() {
        // 检查是否存在剧本弹出层
        const scriptPopup = document.getElementById('scriptPopup');
        if (scriptPopup) {
            // 监听剧本弹出层的显示状态变化
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        // 如果弹出层显示，为其中的图片添加事件
                        if (scriptPopup.style.display === 'block') {
                            const popupImages = scriptPopup.querySelectorAll('img:not([data-popup="false"])');
                            popupImages.forEach(img => {
                                if (!img.hasAttribute('data-popup-initialized')) {
                                    img.setAttribute('data-popup', 'true');
                                    img.setAttribute('data-popup-initialized', 'true');
                                    
                                    img.addEventListener('click', function() {
                                        showImagePopup(this.src, this.alt);
                                    });
                                }
                            });
                        }
                    }
                });
            });
            
            observer.observe(scriptPopup, { attributes: true });
        }
    }
    
    // 初始化时调用一次
    addPopupImagesListener();
    
    // 设置DOM变化观察器，处理动态加载内容
    const bodyObserver = new MutationObserver(function(mutations) {
        // 当DOM变化时，检查是否有新的图片元素
        let needsUpdate = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    // 检查是否是元素节点
                    if (node.nodeType === 1) {
                        // 检查是否是图片元素
                        if (node.tagName === 'IMG') {
                            needsUpdate = true;
                        }
                        // 或者是否包含图片元素
                        else if (node.querySelectorAll) {
                            const hasImages = node.querySelectorAll('img').length > 0;
                            if (hasImages) {
                                needsUpdate = true;
                            }
                        }
                    }
                });
            }
        });
        
        // 如果检测到新的图片，更新事件监听
        if (needsUpdate) {
            addImagePopupListeners();
        }
    });
    
    // 开始观察整个文档的变化
    bodyObserver.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
    // 更新图片变换
    function updateImageTransform() {
        // 直接设置transform样式，省略中间变量和字符串模板计算
        popupImage.style.transform = "translate(" + translateX + "px, " + translateY + "px) scale(" + scale + ")";
    }
    
    // 关闭弹出层
    function closePopup() {
        // 获取恢复滚动位置
        const scrollY = document.body.style.top ? parseInt(document.body.style.top) * -1 : 0;
        
        // 隐藏弹窗
        popupOverlay.style.display = 'none';
        
        // 恢复body正常滚动
        document.documentElement.classList.remove('popup-open'); // 解锁html元素
        document.body.classList.remove('popup-open');
        document.documentElement.style.overflow = ''; // 解锁html元素
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.height = '';
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
        
        // 启用页面所有其他元素的交互，但保留弹出层的高z-index
        document.querySelectorAll('body > *:not(.image-popup-overlay)').forEach(element => {
            if (element !== popupOverlay) {
                element.removeAttribute('aria-hidden');
                if (element.getAttribute('data-original-zindex')) {
                    element.style.zIndex = element.getAttribute('data-original-zindex');
                    element.removeAttribute('data-original-zindex');
                } else {
                    element.style.zIndex = '';
                }
            }
        });
        
        // 确保剧本弹窗和DM弹窗保持高z-index
        const scriptPopup = document.getElementById('scriptPopup');
        const dmPopup = document.getElementById('dmPopup');
        const scriptOverlay = document.getElementById('scriptPopupOverlay');
        const dmOverlay = document.getElementById('dmPopupOverlay');
        
        // 修复脚本卡片的z-index，确保关闭按钮可点击
        if (scriptPopup && scriptPopup.style.display === 'block') {
            scriptPopup.style.zIndex = '1001';
            if (scriptOverlay) scriptOverlay.style.zIndex = '1000';
            
            // 优化：增强关闭按钮的选择器匹配
            const closeBtn = scriptPopup.querySelector('.script-popup-close');
            if (closeBtn) {
                closeBtn.style.zIndex = '1002';
                
                // 增大关闭按钮的点击区域
                closeBtn.style.width = '70px';  // 增大宽度
                closeBtn.style.height = '70px'; // 增大高度
                closeBtn.style.top = '5px';     // 调整位置
                closeBtn.style.right = '5px';   // 调整位置
                closeBtn.style.fontSize = '36px'; // 增大字体
                closeBtn.style.background = 'rgba(0,0,0,0.15)'; // 增加背景色以便于视觉识别
                closeBtn.style.borderRadius = '50%'; // 圆形背景
                closeBtn.style.display = 'flex';
                closeBtn.style.alignItems = 'center';
                closeBtn.style.justifyContent = 'center';
                closeBtn.style.cursor = 'pointer';
                closeBtn.style.touchAction = 'manipulation'; // 优化触摸操作
                closeBtn.style.webkitTapHighlightColor = 'transparent'; // 去除触摸高亮
                closeBtn.style.pointerEvents = 'auto'; // 确保能接收点击事件
                
                // 重新绑定事件，确保可点击性
                const originalOnclick = closeBtn.getAttribute('onclick');
                
                // 完全移除原始的onclick属性
                closeBtn.removeAttribute('onclick');
                
                // 清除所有现有的事件监听器
                const newCloseBtn = closeBtn.cloneNode(true);
                closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
                
                // 在短暂延迟后重新绑定事件（确保DOM已经完全更新）
                setTimeout(() => {
                    // 尝试使用原始onclick内容
                    if (originalOnclick && originalOnclick.includes('closeScriptPopup')) {
                        // 直接绑定全局函数
                        if (typeof window.closeScriptPopup === 'function') {
                            newCloseBtn.addEventListener('click', function(e) {
                                e.stopPropagation();
                                window.closeScriptPopup();
                                return false;
                            }, { capture: true });
                            
                            // 为移动设备添加触摸事件
                            newCloseBtn.addEventListener('touchstart', function(e) {
                                e.stopPropagation();
                            }, { capture: true });
                            
                            newCloseBtn.addEventListener('touchend', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                window.closeScriptPopup();
                                return false;
                            }, { capture: true });
                        } else {
                            // 如果全局函数不存在，尝试直接设置onclick字符串
                            newCloseBtn.setAttribute('onclick', 'closeScriptPopup(); return false;');
                        }
                    } else {
                        // 尝试重新设置onclick为closeScriptPopup
                        newCloseBtn.setAttribute('onclick', 'closeScriptPopup(); return false;');
                        
                        // 同时尝试使用事件监听器
                        if (typeof window.closeScriptPopup === 'function') {
                            newCloseBtn.addEventListener('click', function(e) {
                                e.stopPropagation();
                                window.closeScriptPopup();
                                return false;
                            }, { capture: true });
                        }
                    }
                }, 100);
            }
        }
        
        // 同样处理DM弹窗的关闭按钮
        if (dmPopup && dmPopup.style.display === 'block') {
            dmPopup.style.zIndex = '1001';
            if (dmOverlay) dmOverlay.style.zIndex = '1000';
            
            const closeBtn = dmPopup.querySelector('.dm-popup-close');
            if (closeBtn) {
                closeBtn.style.zIndex = '1002';
                
                // 增大关闭按钮的点击区域
                closeBtn.style.width = '70px';  // 增大宽度
                closeBtn.style.height = '70px'; // 增大高度
                closeBtn.style.top = '5px';     // 调整位置
                closeBtn.style.right = '5px';   // 调整位置
                closeBtn.style.fontSize = '36px'; // 增大字体
                closeBtn.style.background = 'rgba(0,0,0,0.15)'; // 增加背景色以便于视觉识别
                closeBtn.style.borderRadius = '50%'; // 圆形背景
                closeBtn.style.display = 'flex';
                closeBtn.style.alignItems = 'center';
                closeBtn.style.justifyContent = 'center';
                closeBtn.style.cursor = 'pointer';
                closeBtn.style.touchAction = 'manipulation'; // 优化触摸操作
                closeBtn.style.webkitTapHighlightColor = 'transparent'; // 去除触摸高亮
                
                // 重新绑定事件
                const clickHandler = closeBtn.getAttribute('onclick');
                if (clickHandler && clickHandler.includes('close')) {
                    // 移除原有的onclick属性，防止事件冲突
                    closeBtn.removeAttribute('onclick');
                    
                    setTimeout(() => {
                        if (typeof window.closeDmPopup === 'function') {
                            // 添加点击事件监听，确保整个按钮区域可点击
                            closeBtn.addEventListener('click', function(e) {
                                window.closeDmPopup();
                                e.stopPropagation();
                            }, { passive: false });
                            
                            // 添加触摸事件，优化移动端体验
                            closeBtn.addEventListener('touchstart', function(e) {
                                e.stopPropagation();
                            }, { passive: false });
                            
                            closeBtn.addEventListener('touchend', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                window.closeDmPopup();
                            }, { passive: false });
                        }
                    }, 100);
                }
            }
        }
    }
    
    // 直接通过原生DOM方法添加事件监听
    closeButton.onclick = function(e) {
        e.stopPropagation(); // 阻止事件冒泡
        closePopup();
    };
    
    // 添加触摸事件监听，确保在触摸设备上能正常关闭
    closeButton.addEventListener('touchstart', function(e) {
        e.stopPropagation(); // 阻止事件冒泡
    }, { passive: false });
    
    closeButton.addEventListener('touchend', function(e) {
        e.stopPropagation(); // 阻止事件冒泡
        e.preventDefault(); // 阻止默认行为
        closePopup();
    }, { passive: false });
    
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
                // 使用完整的closePopup函数，确保正确恢复所有元素状态
                closePopup();
                
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
            // 使用完整的closePopup函数，而不是简单隐藏
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
                // 计算新位置
                const newTranslateX = initialTranslateX + (touch.clientX - startX);
                const newTranslateY = initialTranslateY + (touch.clientY - startY);
                
                // 获取图片当前尺寸
                const imgWidth = popupImage.naturalWidth || popupImage.width;
                const imgHeight = popupImage.naturalHeight || popupImage.height;
                
                // 计算放大后的图片尺寸
                const scaledWidth = imgWidth * scale;
                const scaledHeight = imgHeight * scale;
                
                // 允许的最大平移量取决于图片放大程度
                const maxTranslateX = Math.max(0, (scaledWidth - window.innerWidth) / 2);
                const maxTranslateY = Math.max(0, (scaledHeight - window.innerHeight) / 2);
                
                // 应用平移限制
                translateX = Math.min(Math.max(newTranslateX, -maxTranslateX), maxTranslateX);
                translateY = Math.min(Math.max(newTranslateY, -maxTranslateY), maxTranslateY);
                
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
                // 使用完整的closePopup函数，而不是简单隐藏弹窗
                closePopup();
            } else {
                // 恢复位置
                popupContainer.style.transform = 'translate(-50%, -50%)';
                popupOverlay.style.opacity = '1';
            }
        }
    }, { passive: true });
}); 