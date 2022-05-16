$.Msg("debug loading")
const logging = () => {
    const data = () => {}
    data.debug = (msg) => {
        $.Msg(msg);
    }
    return data
}
