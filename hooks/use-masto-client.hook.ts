import { getMastoClient } from '@/utils/masto';
import { useUserSession } from './use-user-session.hook';

export const useMastoClient = () => {
    const { token, } = useUserSession()
    const masto = getMastoClient(token);

    return masto
}
