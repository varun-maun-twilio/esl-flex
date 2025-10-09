/*

avayacit02@nextbet.com - avayacit02@dafa773.com - Arion
avayacit03@nextbet.com - avayacit03@dafa773.com - Agent

*/

const emailAddresses = [
    {
            originalTarget:"avayacit03@nextbet.com",
            twilioEmail:"avayacit03@dafa773.com",
            smtpDetails:{
                serverHost:"",
                serverPort:5050,
            },
            outboundQueueSid:"WQab086428e29b0782e79d6cc1d70454b8",
            visibility:{
                teams:["China","India"]
            }
    },
    {
        originalTarget:"avayacit02@nextbet.com",
        twilioEmail:"avayacit02@dafa773.com",
        outboundQueueSid:"WQab086428e29b0782e79d6cc1d70454b8",
        smtpDetails:{
            serverHost:"",
            serverPort:5050,
        }
}
]


module.exports = {
    emailAddresses,
  };
  
