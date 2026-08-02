/**
 * =====================================================
 * ABUFAUZAN TECH Cooperative Management Platform
 * Repository Module: RP-011
 *
 * File: memberRepository.js
 * Version: 2.0.0
 *
 * Adapter Based Member Repository
 * =====================================================
 */

import { CMPBaseRepository } from "./baseRepository.js";
import { CMPAdapterFactory } from "../adapters/adapterFactory.js";


export class CMPMemberRepository
    extends CMPBaseRepository {


    constructor() {

        super(
            CMPAdapterFactory.firebase("members")
        );

    }


}
