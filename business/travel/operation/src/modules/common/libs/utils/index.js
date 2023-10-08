import SnUtils from './external'
import * as constant from './constant'
import * as airlinelogos from './airlinelogos'
import * as config4custinfo from './config4custinfo'
import * as config4financial from './config4financial'
import * as config4orderstatus from './config4orderstatus'
import * as config4ordertype from './config4ordertype'
import * as config4psgstatus from './config4psgstatus'
import * as config4ticketstatus from './config4ticketstatus'
import * as util from './util'

export default Object.assign({}, SnUtils, constant, airlinelogos, config4custinfo, config4financial, config4orderstatus,
    config4ordertype, config4psgstatus,config4ticketstatus, util);