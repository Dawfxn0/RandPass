// DOM元素
const passwordLength = document.getElementById('password-length');
const lengthValue = document.getElementById('length-value');
const includeUppercase = document.getElementById('include-uppercase');
const includeLowercase = document.getElementById('include-lowercase');
const includeNumbers = document.getElementById('include-numbers');
const includeSpecial = document.getElementById('include-special');
const generatedPassword = document.getElementById('generated-password');
const generateButton = document.getElementById('generate-button');
const copyButton = document.getElementById('copy-button');
const saveButton = document.getElementById('save-button');
const viewPasswordsButton = document.getElementById('view-passwords-button');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

// 字符集
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

// 初始化时生成一个密码
window.addEventListener('load', () => {
    generatePassword();
    
    // 初始化模态对话框
    const noteModal = document.getElementById('note-modal');
    const noteInput = document.getElementById('note-input');
    const saveNoteButton = document.getElementById('save-note-button');
    const cancelNoteButton = document.getElementById('cancel-note-button');
    let currentPasswordToSave = '';
    
    // 保存密码按钮点击事件
saveButton.addEventListener('click', () => {
    const password = generatedPassword.value;
    if (!password) {
        alert('请先生成一个密码');
        return;
    }
    
    // 保存当前要保存的密码
    currentPasswordToSave = password;
    
    // 清空输入框
    noteInput.value = '';
    
    // 显示模态对话框
    noteModal.classList.add('active');
    
    // 聚焦到输入框
    setTimeout(() => {
        noteInput.focus();
    }, 100);
});

// 保存备注按钮点击事件
saveNoteButton.addEventListener('click', () => {
    const note = noteInput.value.trim();
    
    // 保存密码到本地存储
    savePasswordToStorage(currentPasswordToSave, note);
    
    // 隐藏模态对话框
    noteModal.classList.remove('active');
    
    // 显示保存成功提示
    alert('密码已保存!');
});

// 取消按钮点击事件
cancelNoteButton.addEventListener('click', () => {
    // 隐藏模态对话框
    noteModal.classList.remove('active');
    
    // 清空当前要保存的密码
    currentPasswordToSave = '';
});

// 点击模态对话框外部关闭
noteModal.addEventListener('click', (e) => {
    if (e.target === noteModal) {
        noteModal.classList.remove('active');
        currentPasswordToSave = '';
    }
});

// 按ESC键关闭模态对话框
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && noteModal.classList.contains('active')) {
        noteModal.classList.remove('active');
        currentPasswordToSave = '';
    }
});

// 按Enter键保存备注
noteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        saveNoteButton.click();
    }
});
});

// 更新密码长度显示
passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
    generatePassword();
});

// 复选框变化时重新生成密码
includeUppercase.addEventListener('change', generatePassword);
includeLowercase.addEventListener('change', generatePassword);
includeNumbers.addEventListener('change', generatePassword);
includeSpecial.addEventListener('change', generatePassword);

// 生成密码按钮点击事件
generateButton.addEventListener('click', generatePassword);

// 复制密码到剪贴板
copyButton.addEventListener('click', () => {
    if (generatedPassword.value) {
        navigator.clipboard.writeText(generatedPassword.value)
            .then(() => {
                const originalText = copyButton.textContent;
                copyButton.textContent = '已复制!';
                copyButton.style.backgroundColor = '#48bb78';
                
                setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.style.backgroundColor = '#667eea';
                }, 2000);
            })
            .catch(err => {
                console.error('复制失败: ', err);
                alert('复制失败，请手动复制');
            });
    }
});



// 查看已保存密码按钮点击事件
viewPasswordsButton.addEventListener('click', () => {
    // 跳转到已保存密码页面
    window.location.href = 'saved-passwords.html';
});

// 生成随机密码函数
function generatePassword() {
    let length = parseInt(passwordLength.value);
    let charset = '';
    let password = '';
    
    // 根据选择的字符类型构建字符集
    if (includeUppercase.checked) charset += uppercaseChars;
    if (includeLowercase.checked) charset += lowercaseChars;
    if (includeNumbers.checked) charset += numberChars;
    if (includeSpecial.checked) charset += specialChars;
    
    // 确保至少选择了一种字符类型
    if (charset.length === 0) {
        charset = lowercaseChars; // 默认使用小写字母
        includeLowercase.checked = true;
    }
    
    // 生成密码
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    // 显示密码
    generatedPassword.value = password;
    
    // 计算并显示密码强度
    updatePasswordStrength(password);
}

// 更新密码强度函数
function updatePasswordStrength(password) {
    let strength = 0;
    const length = password.length;
    
    // 长度检查
    if (length >= 12) strength += 2;
    else if (length >= 8) strength += 1;
    
    // 字符类型检查
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    if (hasUppercase) strength += 1;
    if (hasLowercase) strength += 1;
    if (hasNumber) strength += 1;
    if (hasSpecial) strength += 1;
    
    // 综合评分
    const maxStrength = 7;
    const strengthPercentage = Math.min((strength / maxStrength) * 100, 100);
    
    // 更新强度条和文本
    strengthBar.style.width = `${strengthPercentage}%`;
    
    if (strengthPercentage >= 80) {
        strengthBar.style.background = 'linear-gradient(to right, #48bb78, #38a169)';
        strengthText.textContent = '密码强度: 强';
        strengthText.style.color = '#48bb78';
    } else if (strengthPercentage >= 50) {
        strengthBar.style.background = 'linear-gradient(to right, #f6ad55, #ed8936)';
        strengthText.textContent = '密码强度: 中';
        strengthText.style.color = '#f6ad55';
    } else {
        strengthBar.style.background = 'linear-gradient(to right, #f56565, #e53e3e)';
        strengthText.textContent = '密码强度: 弱';
        strengthText.style.color = '#f56565';
    }
}

// 保存密码到本地存储
function savePasswordToStorage(password, note) {
    const savedPasswords = getSavedPasswords();
    
    // 添加新密码
    savedPasswords.push({
        password: password,
        note: note,
        timestamp: new Date().toISOString()
    });
    
    // 保存到本地存储
    localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
}

// 从本地存储获取保存的密码
function getSavedPasswords() {
    const saved = localStorage.getItem('savedPasswords');
    return saved ? JSON.parse(saved) : [];
}