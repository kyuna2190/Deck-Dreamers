// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyCGgRBPAF2W0KKw0tX2zwZeyjDGgvv31KM",
    authDomain: "deck-dreamers.firebaseapp.com",
    projectId: "deck-dreamers",
    storageBucket: "deck-dreamers.appspot.com",
    messagingSenderId: "165933225805",
    appId: "1:165933225805:web:4e5a3907fc5c7a30a28a6c"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM要素の取得
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const playerNameInput = document.getElementById('playerName');
const messageDiv = document.getElementById('message');
const playerInfoDiv = document.getElementById('playerInfo');

// プレイヤー名の入力チェック
playerNameInput.addEventListener('input', function() {
    if (this.value.length > 20) {
        this.value = this.value.slice(0, 20);
    }
});

// ページ読み込み時の処理
window.addEventListener('load', () => {
    const savedPlayerId = localStorage.getItem('playerId');
    const savedPlayerName = localStorage.getItem('playerName');
    
    if (savedPlayerId && savedPlayerName) {
        playerInfoDiv.textContent = `現在のログイン: ${savedPlayerName} (ID: ${savedPlayerId})`;
        logoutButton.style.display = 'block'; // ログアウトボタンを表示
    } else {
        playerInfoDiv.style.display = 'none';
        logoutButton.style.display = 'none'; // ログアウトボタンを非表示
    }
});

// ログイン処理
loginButton.addEventListener('click', async () => {
    const playerName = playerNameInput.value.trim();

    if (!playerName) {
        showMessage('プレイヤー名を入力してください', 'error');
        return;
    }

    try {
        loginButton.disabled = true;

        // 現在のログイン状態を確認
        const currentLoginDoc = await db.collection('CurrentLogin').doc('active').get();
        if (currentLoginDoc.exists) {
            const currentPlayerId = currentLoginDoc.data().playerId;
            showMessage(`現在、プレイヤーID: ${currentPlayerId} がログイン中です。`, 'error');
            loginButton.disabled = false;
            return;
        }

        // プレイヤー名で検索
        const playerQuery = await db.collection('Player')
            .where('playerName', '==', playerName)
            .get();

        if (playerQuery.empty) {
            showMessage('プレイヤーが見つかりません', 'error');
            loginButton.disabled = false;
            return;
        }

        // プレイヤー情報を取得
        const playerData = playerQuery.docs[0].data();
        const playerId = playerData.playerId;

        // ローカルストレージに保存
        localStorage.setItem('playerName', playerName);
        localStorage.setItem('playerId', playerId);

        // 現在のログイン状態をFirestoreに保存
        await db.collection('CurrentLogin').doc('active').set({ playerId });

        // プレイヤー情報を表示
        playerInfoDiv.style.display = 'block';
        playerInfoDiv.textContent = `プレイヤーID: ${playerId}`;
        
        showMessage('ログインしました', 'success');

        // ログアウトボタンを表示
        logoutButton.style.display = 'block';

        // 3秒後にタイトル画面に戻る
        setTimeout(() => {
            window.location.href = 'title.html';
        }, 3000);

    } catch (error) {
        console.error('ログインエラー:', error);
        showMessage('ログインに失敗しました', 'error');
    } finally {
        loginButton.disabled = false;
    }
});
// ログアウト処理
logoutButton.addEventListener('click', async () => {
    try {
        // Firestoreから現在のログイン情報を削除
        await db.collection('CurrentLogin').doc('active').delete();
        
        // ローカルストレージからプレイヤー情報を削除
        localStorage.removeItem('playerName');
        localStorage.removeItem('playerId');

        // UIを更新
        playerInfoDiv.style.display = 'none';
        logoutButton.style.display = 'none';

        showMessage('ログアウトしました', 'success');
    } catch (error) {
        console.error('ログアウトエラー:', error);
        showMessage('ログアウトに失敗しました', 'error');
    }
});

// メッセージ表示関数
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type} show`;
}

// エラーハンドリング
window.addEventListener('error', function(event) {
    console.error('グローバルエラー:', event.error);
});