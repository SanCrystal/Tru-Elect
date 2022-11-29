import {BsFillPersonPlusFill,BsDisplay} from 'react-icons/bs'
import {FaLink,FaRegStopCircle} from 'react-icons/fa'
import {GoSettings} from 'react-icons/go'
import {ImUpload} from 'react-icons/im'
import {VscDebugStart} from 'react-icons/vsc'
import {MdOutlineCountertops} from 'react-icons/md'

const data = [
    {id:1,title:'Connect Wallet',body:'Connect Wallet to access the voting platform',icon:<FaLink/>},
    {id:2,title:'Register and Get Verified',body:'Register your account and get verified, by the electorial body, to validate the user votes and ensure no bots are in participation.',icon:<BsFillPersonPlusFill/>},
    {id:3,title:'Setup Election',body:'A Recognized electorial body can setup an election for candidates and have the valid voters uploaded for the voting process.',icon:<GoSettings/>},
    {id:4,title:'Upload Valid Voters',body:'A Recognized electorial body uploads valid voters for the voting process.',icon:<ImUpload/>},
    {id:5,title:'Start Voting Process',body:'A Recognized electorial body initiate the voting process for a particular time frame, after successfully validating that all voting parameters are in check.',icon:<VscDebugStart/>},
    {id:6,title:'Stop Voting process',body:'A Recognized electorial stops the voting process after the giving timeframe is over.',icon:<FaRegStopCircle/>},
    {id:7,title:'Count Votes',body:'Voting counts is done by the recognized electorial body for all candidates who participated in the election.',icon:<MdOutlineCountertops/>},
    {id:8,title:'Display Results',body:'The results are made publicly available to all by the electorial body as soon as the counting process is done.',icon:<BsDisplay/>},

]

export default data;