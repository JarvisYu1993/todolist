function errorHandle(res) {
    res.writeHead(400, headers);
    const data = {
        status: 'failed',
        message: '未填寫欄位'
    };
    res.end(JSON.stringify(data));
}

module.exports = errorHandle;