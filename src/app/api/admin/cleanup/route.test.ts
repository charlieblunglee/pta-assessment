import {beforeEach,describe,expect,it,vi} from "vitest";
const mocks=vi.hoisted(()=>({access:vi.fn(),rpc:vi.fn()}));
vi.mock("@/server/admin/access",()=>({adminAccess:mocks.access,sameOrigin:(r:Request)=>r.headers.get("origin")===new URL(r.url).origin}));
vi.mock("@/lib/supabase/admin",()=>({createSupabaseAdminClient:()=>({rpc:mocks.rpc})}));
import {DELETE} from "./route";
const id="11111111-1111-4111-8111-111111111111";
const request=(confirmation=id,origin="https://admin.example.com")=>new Request("https://admin.example.com/api/admin/cleanup",{method:"DELETE",headers:{origin,"Content-Type":"application/json"},body:JSON.stringify({assessmentId:id,confirmation,updatedAt:"2026-10-05T00:00:00Z"})});
describe("owner-only cleanup",()=>{
  beforeEach(()=>{vi.clearAllMocks();mocks.access.mockResolvedValue({owner:true});mocks.rpc.mockResolvedValue({data:id,error:null});});
  it("denies delegated and anonymous users",async()=>{mocks.access.mockResolvedValue({owner:false});expect((await DELETE(request())).status).toBe(403);mocks.access.mockResolvedValue(null);expect((await DELETE(request())).status).toBe(403);expect(mocks.rpc).not.toHaveBeenCalled();});
  it("requires same origin and exact confirmation",async()=>{expect((await DELETE(request(id,"https://other.example.com"))).status).toBe(403);expect((await DELETE(request("DELETE"))).status).toBe(400);expect(mocks.rpc).not.toHaveBeenCalled();});
  it("targets exactly one assessment and preserves account",async()=>{const r=await DELETE(request());expect(r.status).toBe(200);expect(mocks.rpc).toHaveBeenCalledWith("delete_assessment_admin",{target_id:id,expected_updated_at:"2026-10-05T00:00:00Z"});expect((await r.json()).accountPreserved).toBe(true);});
  it("blocks stale assessments and stored evidence",async()=>{mocks.rpc.mockResolvedValue({data:null,error:{message:"ASSESSMENT_CHANGED"}});expect((await DELETE(request())).status).toBe(409);mocks.rpc.mockResolvedValue({data:null,error:{message:"EVIDENCE_CLEANUP_REQUIRED"}});expect((await DELETE(request())).status).toBe(409);});
});
