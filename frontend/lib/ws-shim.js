const WS = typeof WebSocket !== 'undefined' ? WebSocket : undefined;
export { WS as WebSocket };
export default WS;
