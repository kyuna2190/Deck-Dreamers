function navigateTo(url, isReturn = false) {
    // 効果音を再生
    if (isReturn) {
        playCancelSound();
    } else {
        playButtonSound();
    }
    
    // フェードアウト効果
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '0';
    
    // 効果音を再生してから遷移
    setTimeout(function() {
        window.location.href = url;
    }, 200);
}

document.getElementById('settingsButton').addEventListener('click', function() {
    navigateTo('../../Music/Music.html');
});

document.getElementById('battleButton').addEventListener('click', function() {
    navigateTo('../../battle/Battle/battle.html');
});

document.getElementById('gatyaBth').addEventListener('click', function() {
    navigateTo('../../battle/gatya/gatya.html');
});

document.getElementById('RuleBtn').addEventListener('click', function() {
    navigateTo('../Rule/Rule.html');
});

document.getElementById('returnButton').addEventListener('click', function() {
    navigateTo('../../title.html', true);
});

// 隠しドットのイベントリスナーを追加
document.getElementById('secret-dot').addEventListener('click', function() {
    navigateTo('../../kakusi/kakusi.html');
});