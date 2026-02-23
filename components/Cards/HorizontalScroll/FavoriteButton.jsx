import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FavoriteButton = ({ isStarred, onPress }) => (
  <TouchableOpacity
    style={{
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: 50,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Ionicons
      name={isStarred ? "heart" : "heart-outline"}
      size={20}
      color={isStarred ? "#FF385C" : "#ffffff"}
    />
  </TouchableOpacity>
);

export default FavoriteButton;
