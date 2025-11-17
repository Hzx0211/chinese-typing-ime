// 简易拼音→汉字字典
// 注意：这是一个示例字典，后续可以替换为更完整的词库
const SIMPLE_DICT = {
    "ni": ["你", "呢", "泥", "逆", "拟"],
    "hao": ["好", "号", "浩", "豪", "毫"],
    "zhong": ["中", "钟", "重", "种", "终"],
    "guo": ["国", "过", "果", "锅", "裹"],
    "shi": ["是", "时", "市", "事", "实"],
    "jie": ["界", "解", "节", "接", "结"],
    "wo": ["我", "握", "窝", "卧", "沃"],
    "men": ["们", "门", "闷", "扪"],
    "de": ["的", "得", "地", "德", "底"],
    "zai": ["在", "再", "载", "灾", "宰"],
    "le": ["了", "乐", "勒", "叻"],
    "zhe": ["这", "者", "着", "折", "哲"],
    "ge": ["个", "各", "歌", "格", "革"],
    "ma": ["吗", "马", "妈", "麻", "码"],
    "yao": ["要", "药", "摇", "腰", "咬"],
    "hui": ["会", "回", "灰", "挥", "汇"],
    "lai": ["来", "赖", "莱", "徕"],
    "qu": ["去", "取", "区", "曲", "趣"],
    "neng": ["能", "弄"],
    "shuo": ["说", "硕", "烁", "朔"],
    "duo": ["多", "夺", "朵", "躲", "舵"],
    "tian": ["天", "田", "填", "甜", "添"],
    "di": ["地", "第", "低", "底", "滴"],
    "ren": ["人", "任", "认", "忍", "仁"],
    "he": ["和", "何", "河", "合", "核"],
    "da": ["大", "打", "达", "答", "搭"],
    "xiao": ["小", "笑", "消", "晓", "校"],
    "kan": ["看", "刊", "砍", "堪", "坎"],
    "jian": ["见", "间", "件", "建", "减"],
    "mei": ["没", "美", "每", "梅", "媒"],
    "you": ["有", "又", "由", "游", "友"],
    "ta": ["他", "她", "它", "塔", "踏"],
    "zhi": ["之", "知", "只", "直", "值"],
    "dao": ["到", "道", "倒", "岛", "刀"],
    "wei": ["为", "位", "微", "围", "维"],
    "sheng": ["生", "声", "省", "升", "胜"],
    "fa": ["发", "法", "罚", "乏", "伐"],
    "zuo": ["做", "作", "坐", "左", "座"],
    "dong": ["动", "东", "冬", "懂", "洞"],
    "xiang": ["想", "向", "像", "香", "响"],
    "chu": ["出", "初", "处", "除", "触"],
    "dui": ["对", "队", "堆", "兑"],
    "ru": ["如", "入", "儒", "乳", "辱"],
    "ke": ["可", "课", "客", "刻", "克"],
    "yi": ["一", "以", "已", "易", "意"],
    "er": ["二", "而", "儿", "耳", "尔"],
    "san": ["三", "散", "伞", "叁"],
    "si": ["四", "死", "思", "司", "丝"],
    "wu": ["五", "无", "物", "务", "武"],
    "liu": ["六", "流", "留", "刘", "柳"],
    "qi": ["七", "起", "期", "齐", "其"],
    "ba": ["八", "把", "吧", "巴", "拔"],
    "jiu": ["九", "就", "久", "酒", "旧"],
    "shi": ["十", "是", "时", "市", "事"]
};

// DOM 元素引用
const pinyinEl = document.getElementById('pinyin');
const resultEl = document.getElementById('result');
const candidatesEl = document.getElementById('candidates');
const copyBtn = document.getElementById('copyBtn');
const statusEl = document.getElementById('status');

/**
 * 更新候选区显示
 * @param {string} pinyin - 输入的拼音字符串
 */
function updateCandidates(pinyin) {
    // 清空候选区
    candidatesEl.innerHTML = '';
    
    // 去除首尾空格并转为小写
    const normalizedPinyin = pinyin.trim().toLowerCase();
    
    // 如果输入为空，不显示候选
    if (!normalizedPinyin) {
        return;
    }
    
    // 使用 web-pinyin-ime 引擎获取候选
    let candidates = [];
    
    if (typeof window.getCandidates === 'function') {
        // 使用完整的拼音引擎
        candidates = window.getCandidates(normalizedPinyin);
    } else {
        // 降级方案：使用简单字典（如果引擎未加载）
        candidates = SIMPLE_DICT[normalizedPinyin] || [];
        if (candidates.length === 0 && normalizedPinyin.length > 0) {
            const noResult = document.createElement('div');
            noResult.textContent = '拼音引擎未加载，请刷新页面';
            noResult.style.padding = '12px';
            noResult.style.color = '#f00';
            noResult.style.fontSize = '18px';
            candidatesEl.appendChild(noResult);
            return;
        }
    }
    
    // 如果没有找到候选，显示提示
    if (candidates.length === 0) {
        const noResult = document.createElement('div');
        noResult.textContent = '未找到候选字';
        noResult.style.padding = '12px';
        noResult.style.color = '#999';
        noResult.style.fontSize = '18px';
        candidatesEl.appendChild(noResult);
        return;
    }
    
    // 为每个候选创建按钮
    // 候选可能是单个字或词组，都显示
    candidates.forEach(candidate => {
        const btn = document.createElement('button');
        btn.className = 'candidate';
        btn.textContent = candidate;
        btn.addEventListener('click', () => chooseCandidate(candidate));
        candidatesEl.appendChild(btn);
    });
}

/**
 * 选择候选字
 * @param {string} char - 选中的汉字
 */
function chooseCandidate(char) {
    // 将选中的字符追加到输出框
    const currentText = resultEl.value;
    resultEl.value = currentText + char;
    
    // 清空拼音输入框
    pinyinEl.value = '';
    
    // 清空候选区
    candidatesEl.innerHTML = '';
    
    // 聚焦到拼音输入框，方便继续输入
    pinyinEl.focus();
}

/**
 * 复制到剪贴板
 */
async function copyToClipboard() {
    const resultText = resultEl.value.trim();
    
    // 检查是否有内容可复制
    if (!resultText) {
        showStatus('当前没有内容可以复制', 'warning');
        return;
    }
    
    // 尝试使用 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(resultText);
            showStatus('已复制到系统剪贴板，可在其他网页粘贴', 'success');
        } catch (err) {
            console.error('复制失败:', err);
            // 降级方案：选中文本
            fallbackCopy(resultText);
        }
    } else {
        // 不支持 Clipboard API，使用降级方案
        fallbackCopy(resultText);
    }
}

/**
 * 降级复制方案：选中文本让用户手动复制
 * @param {string} text - 要复制的文本
 */
function fallbackCopy(text) {
    try {
        // 聚焦并选中输出框的全部文本
        resultEl.focus();
        resultEl.select();
        
        // 尝试使用 document.execCommand（已废弃但兼容性好）
        if (document.execCommand && document.execCommand('copy')) {
            showStatus('已复制到系统剪贴板', 'success');
        } else {
            showStatus('已经选中全部文本，请手动执行复制（在 Quest3 中长按选择复制）', 'info');
        }
    } catch (err) {
        console.error('降级复制失败:', err);
        showStatus('复制失败，请手动长按选择后复制', 'error');
    }
}

/**
 * 显示状态提示
 * @param {string} message - 提示消息
 * @param {string} type - 类型：'info', 'success', 'error', 'warning'
 */
function showStatus(message, type = 'info') {
    statusEl.textContent = message;
    statusEl.className = '';
    statusEl.classList.add(`status-${type}`);
    
    // 3秒后清除状态（可选）
    setTimeout(() => {
        if (statusEl.textContent === message) {
            statusEl.textContent = '';
            statusEl.className = '';
        }
    }, 3000);
}

// 初始化事件监听
function init() {
    // 监听拼音输入框的输入事件
    pinyinEl.addEventListener('input', (e) => {
        const pinyin = e.target.value;
        updateCandidates(pinyin);
    });
    
    // 监听复制按钮点击
    copyBtn.addEventListener('click', copyToClipboard);
    
    // 初始聚焦到拼音输入框
    pinyinEl.focus();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

